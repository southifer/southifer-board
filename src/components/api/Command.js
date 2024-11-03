import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Command {
    constructor (index, script) {
        this.index = index;
        this.script = script;
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
        try {
            await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            toast.success(`(${this.index}) running tutorial`);
        } catch (error) {
            toast.error(`(${this.index}) failed running tutorial`);
        }
    }
    async stopTutorial() {
        const script = `
            local bot = getBot(${this.index})
            local tutorial = bot.auto_tutorial
            tutorial.enabled = false
        `;
        try {
            await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            toast.success(`(${this.index}) stopping tutorial`);
        } catch (error) {
            toast.error(`(${this.index}) error stopping tutorial`);
        }
    }

    async startRotasi() {
        const script = `
        local bot = getBot(${this.index})
        local script = read("rotasi-luci-json.lua")

        if not bot:isRunningScript() then
            bot:runScript(script)
            sleep(5000)
        end`;
        try {
            await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            toast.success(`(${this.index}) starting rotation`);
        } catch (error) {
            toast.error(`(${this.index}) error starting rotation`);
        }
    }

    async removeBot() {
        const script = `
            local bot = getBot(${this.index})
            removeBot(bot.name)
        `;
        try {
            await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            toast.success(`(${this.index}) bot removed`);
        } catch (error) {
            toast.error(`(${this.index}) erro starting rotation`);
        }
    }

    async reconnectBot() {
        const script = `
            local bot = getBot(${this.index})
            bot:connect()
        `;
        try {
            await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        } catch (error) {
        }
    }
    async disconnectBot() {
        const script = `
            local bot = getBot(${this.index})
            bot:disconnect()
        `;
        try {
            await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        } catch (error) {
        }
    }
    async executeScript() {
        try {
            await axios.post('http://191.96.94.35:8000/bot/runScript', this.script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            toast.success(`(${this.index}) script executed`);
        } catch (error) {
            toast.error(`(${this.index}) error executing script`);
        }
    }
    async stopScript() {
        const script = `
            local bot = getBot(${this.index})
            bot:stopScript()
        `;
        try {
            await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            toast.success(`(${this.index}) script stopped`);
        } catch (error) {
            toast.success(`(${this.index}) failed stopping script`);
        }
    }
    async startLeveling() {
        const script = `
            local bot = getBot(${this.index})
            local script = read("rotasi-mass-1.lua")

            if not bot:isRunningScript() then
                bot:runScript(script)
            end
        `;
        try {
            await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            toast.success(`(${this.index}) is now leveling`);
        } catch (error) {
            toast.success(`(${this.index}) failed to start leveling`);
        }
    }
}

export default Command;