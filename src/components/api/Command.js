import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CONFIG from '../config/Config.json'

class Command {
    constructor(index, script) {
        this.index = index;
        this.script = script;
    }

    async executeScriptRequest(script, successMessage, errorMessage) {
        try {
            await axios.post(`${CONFIG.BASE_URL}/bot/runScript`, script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            toast.success(`(${this.index}) ${successMessage}`);
        } catch (error) {
            toast.error(`(${this.index}) ${errorMessage}`);
        }
    }

    async startTutorial() {
        const script = `
            local bot = getBot(${this.index})
            local tutorial = bot.auto_tutorial
            tutorial.enabled = true
            tutorial.auto_quest = true
            tutorial.set_as_home = true
            tutorial.set_high_level = true
            tutorial.set_random_skin = true
            tutorial.set_random_profile = true
            tutorial.detect_tutorial = true
            return tutorial.detect_tutorial
        `;
        this.executeScriptRequest(script, 'running tutorial', 'failed to run tutorial');
    }

    async stopTutorial() {
        const script = `
            local bot = getBot(${this.index})
            local tutorial = bot.auto_tutorial
            tutorial.enabled = false
        `;
        this.executeScriptRequest(script, 'stopping tutorial', 'failed to stop tutorial');
    }

    async startRotasi() {
        const script = `
            local bot = getBot(${this.index})
            local script = read("C:\\Users\\Administrator\\Desktop\\rotasi-luci-json.lua")
            if not bot:isRunningScript() then
                bot:runScript(script)
                sleep(5000)
            end
        `;
        this.executeScriptRequest(script, 'starting rotation', 'failed to start rotation');
    }

    async removeBot() {
        const script = `
            local bot = getBot(${this.index})
            removeBot(bot.name)
        `;
        this.executeScriptRequest(script, 'bot removed', 'failed to remove bot');
    }

    async reconnectBot() {
        const script = `
            local bot = getBot(${this.index})
            bot:disconnect()
            sleep(1000)
            bot:connect()
        `;
        this.executeScriptRequest(script, 'bot reconnected', 'failed to reconnect bot');
    }

    async disconnectBot() {
        const script = `
            local bot = getBot(${this.index})
            bot:disconnect()
        `;
        this.executeScriptRequest(script, 'bot disconnected', 'failed to disconnect bot');
    }

    async executeScript() {
        this.executeScriptRequest(this.script, 'script executed', 'error executing script');
    }

    async stopScript() {
        const script = `
            local bot = getBot(${this.index})
            bot:stopScript()
        `;
        this.executeScriptRequest(script, 'script stopped', 'failed to stop script');
    }

    async startLeveling() {
        const script = `
            local bot = getBot(${this.index})
            local script = read("rotasi-mass-2.lua")
            if not bot:isRunningScript() then
                bot:runScript(script)
            end
        `;
        this.executeScriptRequest(script, 'now leveling', 'failed to start leveling');
    }
}

export default Command;