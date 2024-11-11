import axios from 'axios';
import CONFIG from '../config/Config.json';

class Interface {
    constructor(index, item) {
        this.index = index;
        this.item = item;
    }

    async executeItemAction(script, action) {
        try {
            const response = await axios.post(`${CONFIG.BASE_URL}/bot/runScript`, script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            console.log(`${action} response:`, response.data);
        } catch (error) {
            console.error(`Error ${action} item (${this.item}):`, error);
        }
    }

    generateScript(action) {
        const itemAction = action === 'wear' ? `bot:${action}(${this.item})` : `bot:${action}(${this.item}, bot:getInventory():findItem(${this.item}))`;
        return `
            bot = getBot(${this.index})
            if bot:isInWorld() and bot:getInventory():findItem(${this.item}) > 0 then
                ${itemAction}
                sleep(500)
            end
        `;
    }

    // Method to trash an item
    async trash() {
        const script = this.generateScript('trash');
        await this.executeItemAction(script, 'trashing');
    }

    // Method to wear an item
    async wear() {
        const script = this.generateScript('wear');
        await this.executeItemAction(script, 'wearing');
    }

    // Method to drop an item
    async drop() {
        const script = this.generateScript('drop');
        await this.executeItemAction(script, 'dropping');
    }
}

export default Interface;