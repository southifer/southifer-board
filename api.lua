server = HttpServer.new()

server:setLogger(function(request, response)
  print(string.format("Method: %s, Path: %s, Status: %i", request.method, request.path, response.status))
end)

server:get("/bot/get", function(request, response)
    response.headers["Access-Control-Allow-Origin"] = "*"  -- Allow all origins (use specific origin in production)
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"  -- Allow methods
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"  -- Allow headers

    local json = require("json")

    local function maladyStatus(malady)
        local maladyNaming = {
            [0] = "None",
            [1] = "Torn Punching Muscle",
            [2] = "Gem Cuts",
            [3] = "Chicken Feet",
            [4] = "Grumbleteeth",
            [5] = "Broken Heart",
            [6] = "Chaos Infection",
            [7] = "Moldy Guts",
            [8] = "Brainworms",
            [9] = "Lupus",
            [10] = "Ecto-Bones",
            [11] = "Fatty Liver",
        }
        return maladyNaming[malady] or "?"
    end

    local function getBotStatus(status)
        local statusNaming = {
            [BotStatus.offline] = "Offline",
            [BotStatus.online] = "Online",
            [BotStatus.account_banned] = "Account Banned",
            [BotStatus.location_banned] = "Location Banned",
            [BotStatus.server_overload] = "Server Overload",
            [BotStatus.too_many_login] = "Too Many Login",
            [BotStatus.maintenance] = "Maintenance",
            [BotStatus.version_update] = "Version Update",
            [BotStatus.server_busy] = "Server Busy",
            [BotStatus.error_connecting] = "Error Connecting",
            [BotStatus.logon_fail] = "Login Failed",
            [BotStatus.http_block] = "HTTP Blocked",
            [BotStatus.wrong_password] = "Wrong Password",
            [BotStatus.advanced_account_protection] = "Advanced Account Protection",
            [BotStatus.bad_name_length] = "Bad Name Length",
            [BotStatus.invalid_account] = "Invalid Account",
            [BotStatus.guest_limit] = "Guest Limit",
            [BotStatus.changing_subserver] = "Changing Subserver",
            [BotStatus.captcha_requested] = "Captcha",
            [BotStatus.mod_entered] = "Mod Entered",
            [BotStatus.high_load] = "High Load",
            [BotStatus.bad_gateway] = "Bad Gateway",
            [BotStatus.server_issue] = "Server Issue",
            [BotStatus.retrieving_token] = "Retrieving Token",
            [BotStatus.player_entered] = "Player Entered",
            [BotStatus.getting_server_data] = "Getting Server Data",
            [BotStatus.bypassing_server_data] = "Bypassing Server Data",
        }
        return statusNaming[status] or "Loading"
    end

    local function getGoogleStatus(googleStatus)
        local googleStatusNaming = {
            [GoogleStatus.idle] = "Idle",
            [GoogleStatus.processing] = "Processing",
            [GoogleStatus.init_error] = "Init Error",
            [GoogleStatus.invalid_credentials] = "Invalid Credentials",
            [GoogleStatus.account_disabled] = "Account Disabled",
            [GoogleStatus.captcha_required] = "Captcha Required",
            [GoogleStatus.phone_required] = "Phone Required",
            [GoogleStatus.recovery_required] = "Recovery Required",
            [GoogleStatus.couldnt_verify] = "Couldn't Verify",
            [GoogleStatus.unknown_url] = "Unknown URL"
        }
        return googleStatusNaming[googleStatus] or "UNKNOWN"
    end

    local bots = getBots()
    local botList = {}

    for i, bot in ipairs(bots) do
        local botData = getBot(bot.name)

        -- Prepare inventory list
        local botInventory = {}
        for _, item in ipairs(bot:getInventory():getItems()) do
            local itemInfo = getInfo(item.id)
            table.insert(botInventory, {
                name = itemInfo.name,
                id = item.id,
                is_clothes = itemInfo.clothing_type ~= 0,
                amount = item.count
            })
        end

        -- Prepare log content
        local consoleLog = {}
        for _,message in pairs(bot:getConsole().contents) do
            table.insert(consoleLog, message)
        end

        -- Add bot details to the bot list
        table.insert(botList, {
            id = index,
            details = {
                index = i,
                name = bot.name,
                level = bot.level,
                ping = bot:getPing(),
                status = getBotStatus(bot.status),
                google_status = getGoogleStatus(bot.google_status),
                task = bot.custom_status or "",
                proxy = bot:getProxy().ip .. ':' .. bot:getProxy().port,
                world = bot:getWorld().name or "N/A",
                malady = maladyStatus(bot.malady),
                position = bot.x .. ':' .. bot.y,
                gems = bot.gem_count,
                obtained_gems = bot.obtained_gem_count or 0,
                playtime = math.ceil(bot:getPlaytime() / 3600),
                online_time = bot:getActiveTime(),
                age = bot:getAge(),
                is_resting = bot:isResting(),
                is_script_run = bot:isRunningScript()
            },
            inventory = botInventory,
            console = consoleLog
        })
    end

    -- Send the response as JSON
    response:setContent(json.encode(botList), "application/json")
end)

server:post("/bot/runScript", function(request, response)
    response.headers["Access-Control-Allow-Origin"] = "*"  -- Allow all origins (use specific origin in production)
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"  -- Allow methods
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"  -- Allow headers

    local script = request.body  -- Get the Lua script from the request body

    -- Attempt to load the script without a custom environment
    local func, err = load(script, "runScript")
    if not func then
        response:setContent("Failed to load script:\n" .. tostring(err), "text/plain")
        return
    end

    -- Attempt to execute the script with pcall for safe execution
    local success, result = pcall(func)
    if success then
        -- Return the result of the script execution
        response:setContent(tostring(result), "text/plain")
    else
        response:setContent(tostring(result), "text/plain")
    end
end)

server:get("/bot/config", function(request, response)
    response.headers["Access-Control-Allow-Origin"] = "*"  -- Allow all origins (use specific origin in production)
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"  -- Allow methods
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"  -- Allow headers

    local configData = read("C:\\Users\\Administrator\\Desktop\\config.json")  -- Use the inbuilt read function to get the file contents
  
    if configData then
        response:setContent(configData, "application/json")  -- Respond with JSON content
    else
        response:setContent("config.json not found.", "text/plain")
    end
end)

server:post("/bot/config", function(request, response)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

    local body = request.body -- Get the request body

    -- Validate and write the JSON data to the config file
    local success = write("C:\\Users\\Administrator\\Desktop\\config.json", body) -- Assuming write is a function you have to write data to a file

    if success then
        response:setContent("Config updated successfully.", "text/plain")
    else
        response:setContent("Failed to update config.", "text/plain")
    end
end)

server:post("/bot/remove", function(request, response)
    -- Set CORS headers
    response:setHeader("Access-Control-Allow-Origin", "*")  -- Allow all origins (use specific origin in production)
    response:setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")  -- Allow methods
    response:setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")  -- Allow headers

    -- Get the name parameter from the request
    local name = request:getParam("name")

    -- Validate the name parameter
    if not name then
        response:setContent("Missing parameter: name.", "text/plain")
        return
    end

    -- Check if the bot exists before removing it
    local bot = getBot(name)
    if not bot then
        response:setContent("Bot not found.", "text/plain")
        return
    end

    -- Attempt to remove the bot
    local success, err = pcall(function()
        removeBot(name)
    end)

    if not success then
        response:setContent("Error removing bot: " .. err, "text/plain")
        return
    end

    response:setContent("You have successfully removed bot " .. name .. ".", "text/plain")
end)

server:post("/bot/add", function(request, response)
    response.headers["Access-Control-Allow-Origin"] = "*"  -- Allow all origins (use specific origin in production)
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"  -- Allow methods
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"  -- Allow headers

    local json = require("json")

    -- Try to retrieve bot information from query parameters
    local botInfo = {
        name = request:getParam("name"),
        password = request:getParam("password"),
        recovery = request:getParam("recovery") or "", -- optional
        mac = request:getParam("mac") or "", -- optional
        rid = request:getParam("rid") or "", -- optional
        proxy = request:getParam("proxy") or "",       -- optional
        platform = Platform.windows -- default to windows if not provided
    }

    -- Check if the required fields are present
    if botInfo.name and botInfo.password then
        -- Attempt to add the bot
        if addBot(botInfo) then
            response:setContent("Bot has been added.", "text/plain")
        else
            response:setContent("Failed to add bot.", "text/plain")
        end
    else
        response:setContent("Invalid input, missing required fields.", "text/plain")
    end
end)

server:get("/bot/bot-backup", function(request, response)
    response.headers["Access-Control-Allow-Origin"] = "*"  -- Allow all origins (use specific origin in production)
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"  -- Allow methods
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"  -- Allow headers

    local backupData = read("C:\\Users\\Administrator\\Desktop\\bot-backup.json")  -- Adjust the path if necessary
    if backupData then
        response:setContent(backupData, "application/json")
    else
        response:setContent("Failed to read backup data.", "text/plain")
    end
end)

server:post("/bot/config", function(request, response)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

    local body = request.body -- Get the request body

    -- Validate and write the JSON data to the config file
    local success = write("C:\\Users\\Administrator\\Desktop\\bot-backup.json", body) -- Assuming write is a function you have to write data to a file

    if success then
        response:setContent("Backup updated successfully.", "text/plain")
    else
        response:setContent("Failed to update Backup.", "text/plain")
    end
end)



server:get("/bot/rotasi-script", function(request, response)
    response.headers["Access-Control-Allow-Origin"] = "*"  -- Allow all origins (use specific origin in production)
    response.headers["Access-Control-Allow-Methods"] = "GET"  -- Allow methods
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"  -- Allow headers

    local backupData = read("C:\\Users\\Administrator\\Desktop\\rotasi-luci-json.lua")  -- Adjust the path if necessary
    if backupData then
        response:setContent(backupData, "text/plain")
    else
        response:setContent("Failed to read backup data.", "text/plain")
    end
end)

server:post("/bot/rotasi-script", function(request, response)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

    local body = request.body -- Get the request body

    -- Validate and write the JSON data to the config file
    local success = write("C:\\Users\\Administrator\\Desktop\\rotasi-luci-json.lua", body) -- Assuming write is a function you have to write data to a file

    if success then
        response:setContent("Backup updated successfully.", "text/plain")
    else
        response:setContent("Failed to update Backup.", "text/plain")
    end
end)

server:listen("0.0.0.0", 8000)