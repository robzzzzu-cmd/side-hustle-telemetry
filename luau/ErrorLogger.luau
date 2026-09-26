--!strict
--[[
  ErrorLogger.luau
  Drop-in Production Error Logger for Roblox ServerScriptService
  
  Features:
  - Hooks into ScriptContext.Error
  - In-memory buffering to prevent HTTP rate-limiting
  - Automatic error deduplication & stack trace fingerprinting within window
  - 30-second interval batch flushes via HttpService:RequestAsync
  - Wrapped completely in pcall to guarantee zero crash impact on game logic
  
  Installation:
  1. Open Roblox Studio -> ServerScriptService
  2. Create a new Script named "ErrorLogger"
  3. Paste this code and set CONFIG.ENDPOINT_URL (or Discord Webhook)
  4. Enable "Allow HTTP Requests" in Game Settings -> Security
]]

local HttpService = game:GetService("HttpService")
local ScriptContext = game:GetService("ScriptContext")
local RunService = game:GetService("RunService")

-- Configuration
local CONFIG = {
	-- Webhook or ingestion endpoint URL
	ENDPOINT_URL = "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL_HERE",
	
	-- Interval between outbound HTTP batches (seconds)
	FLUSH_INTERVAL_SECONDS = 30,
	
	-- Maximum distinct error fingerprints buffered per cycle
	MAX_BUFFER_SIZE = 50,
	
	-- Set true to log errors while testing in Roblox Studio
	ENABLE_STUDIO_LOGGING = false,
	
	-- Optional custom authentication header for private ingest APIs
	AUTH_TOKEN = ""
}

type ErrorRecord = {
	message: string,
	stackTrace: string,
	scriptInstance: string,
	occurrenceCount: number,
	firstSeen: number,
	lastSeen: number,
}

local errorBuffer: { [string]: ErrorRecord } = {}
local errorCount = 0

-- Compute deduplication hash
local function getErrorFingerprint(message: string, stack: string): string
	return message .. "@" .. string.sub(stack, 1, 120)
end

-- Capture and buffer runtime error
local function onErrorCaptured(message: string, stack: string, scriptInstance: Instance?)
	if RunService:IsStudio() and not CONFIG.ENABLE_STUDIO_LOGGING then
		return
	end

	local success, err = pcall(function()
		local scriptName = scriptInstance and scriptInstance:GetFullName() or "UnknownScript"
		local fingerprint = getErrorFingerprint(message, stack)

		local existing = errorBuffer[fingerprint]
		if existing then
			existing.occurrenceCount += 1
			existing.lastSeen = os.time()
		else
			if errorCount >= CONFIG.MAX_BUFFER_SIZE then
				return -- Prevent unbounded memory consumption during crash cascades
			end

			errorBuffer[fingerprint] = {
				message = message,
				stackTrace = stack,
				scriptInstance = scriptName,
				occurrenceCount = 1,
				firstSeen = os.time(),
				lastSeen = os.time(),
			}
			errorCount += 1
		end
	end)

	if not success then
		warn("[ErrorLogger] Failed to buffer error: " .. tostring(err))
	end
end

-- Flush buffer to remote HTTP endpoint
local function flushBuffer()
	if errorCount == 0 then
		return
	end

	local currentBuffer = errorBuffer
	local currentCount = errorCount
	errorBuffer = {}
	errorCount = 0

	task.spawn(function()
		local success, reqErr = pcall(function()
			local errorList = {}
			for _, record in pairs(currentBuffer) do
				table.insert(errorList, {
					script = record.scriptInstance,
					message = record.message,
					stack = record.stackTrace,
					count = record.occurrenceCount,
					firstSeen = record.firstSeen,
					lastSeen = record.lastSeen,
				})
			end

			local payload = {
				placeId = game.PlaceId,
				placeVersion = game.PlaceVersion,
				jobId = game.JobId,
				serverTime = os.time(),
				errorTotal = currentCount,
				errors = errorList,
			}

			local headers: { [string]: string } = {
				["Content-Type"] = "application/json",
			}
			if CONFIG.AUTH_TOKEN ~= "" then
				headers["X-Telemetry-Auth"] = CONFIG.AUTH_TOKEN
			end

			-- Format Discord Webhook embed if endpoint is Discord
			local requestBody: string
			if string.find(CONFIG.ENDPOINT_URL, "discord.com/api/webhooks") then
				local fields = {}
				for i, rec in ipairs(errorList) do
					if i > 5 then break end
					table.insert(fields, {
						name = string.format("💥 [%d occurrences] in %s", rec.count, rec.script),
						value = string.format("```luau\n%s\n```\n*Trace:* `%s`", string.sub(rec.message, 1, 300), string.sub(rec.stack, 1, 150)),
						inline = false
					})
				end

				local discordPayload = {
					username = "Roblox Crash Sentry",
					embeds = {
						{
							title = string.format("🔴 %d Runtime Crashes Detected (Place %d)", currentCount, game.PlaceId),
							description = string.format("JobId: `%s` | Version: %d", game.JobId, game.PlaceVersion),
							color = 15158332, -- Red
							fields = fields,
							timestamp = DateTime.now():ToIsoDate(),
						}
					}
				}
				requestBody = HttpService:JSONEncode(discordPayload)
			else
				requestBody = HttpService:JSONEncode(payload)
			end

			local response = HttpService:RequestAsync({
				Url = CONFIG.ENDPOINT_URL,
				Method = "POST",
				Headers = headers,
				Body = requestBody,
			})

			if not response.Success then
				warn(string.format("[ErrorLogger] Ingest returned HTTP %d: %s", response.StatusCode, response.StatusMessage))
			end
		end)

		if not success then
			warn("[ErrorLogger] Failed to dispatch error batch: " .. tostring(reqErr))
		end
	end)
end

-- Connect to global script errors
ScriptContext.Error:Connect(onErrorCaptured)

-- Background 30-second recurring flush loop
task.spawn(function()
	while true do
		task.wait(CONFIG.FLUSH_INTERVAL_SECONDS)
		flushBuffer()
	end
end)

-- Flush before server shutdown
game:BindToClose(function()
	flushBuffer()
	task.wait(1)
end)

print(string.format("[ErrorLogger] Initialized successfully. Flushing every %d seconds.", CONFIG.FLUSH_INTERVAL_SECONDS))
