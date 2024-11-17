import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CONFIG from '../config/Config.json';

class Command {
    constructor(index, script) {
        this.index = index;
        this.script = script;
    }

    async executeScriptRequest(script, action) {
        const successMessage = `${action} successful`;
        const errorMessage = `${action} failed`;

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

    generateLoopScript(botActions) {
        return `
            for _,i in pairs(${this.index}) do
                local bot = getBot(i)
                ${botActions}
            end
        `;
    }

    async startTutorial() {
        const script = this.generateLoopScript(`
            local tutorial = bot.auto_tutorial
            tutorial.enabled = true
            tutorial.auto_quest = true
            tutorial.set_as_home = true
            tutorial.set_high_level = true
            tutorial.set_random_skin = true
            tutorial.set_random_profile = true
            tutorial.detect_tutorial = true
        `);
        this.executeScriptRequest(script, 'Starting tutorial');
    }

    async stopTutorial() {
        const script = this.generateLoopScript(`
            bot.auto_tutorial.enabled = false
        `);
        this.executeScriptRequest(script, 'Stopping tutorial');
    }

    async startRotasi() {
        const script = `
            local script = read("C:\\\\Users\\\\Administrator\\\\Desktop\\\\rotasi-luci-json.lua")
            ${this.generateLoopScript(`
                bot:runScript(script)
            `)}
        `;
        console.log(script);
        this.executeScriptRequest(script, 'Starting rotation');
    }

    async removeBot() {
        const script = this.generateLoopScript(`
            removeBot(bot.name)
        `);
        this.executeScriptRequest(script, 'Removing bot');
    }

    async reconnectBot() {
        const script = this.generateLoopScript(`
            bot:disconnect()
            sleep(1000)
            bot:connect()
        `);
        this.executeScriptRequest(script, 'Reconnecting bot');
    }

    async disconnectBot() {
        const script = this.generateLoopScript(`
            bot:disconnect()
        `);
        this.executeScriptRequest(script, 'Disconnecting bot');
    }

    async executeScript() {
        this.executeScriptRequest(this.script, 'Executing script');
    }

    async stopScript() {
        const script = this.generateLoopScript(`
            bot:stopScript()
        `);
        this.executeScriptRequest(script, 'Stopping script');
    }

    async startLeveling() {
        const script = `
            local script = read("rotasi-mass-2.lua")
            ${this.generateLoopScript(`
                if not bot:isRunningScript() then
                    bot:runScript(script)
                end
            `)}
        `;
        this.executeScriptRequest(script, 'Starting leveling');
    }
}

export default Command;