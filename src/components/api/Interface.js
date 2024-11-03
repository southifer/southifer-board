import axios from 'axios';

class Interface {
    constructor(index, item) {
        this.index = index;
        this.item = item;
    }

    // Method to trash an item
    async trash() {
        const script = `
        bot = getBot(${this.index})
        if bot:isInWorld() and bot:getInventory():findItem(${this.item}) > 0 then
            bot:trash(${this.item}, bot:getInventory():findItem(${this.item}))
            sleep(500)
        end
        `;
        try {
            const response = await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            console.log('Trash response:', response.data);
        } catch (error) {
            console.error('Error trashing item:', error);
        }
    }

    // Method to wear an item
    async wear() {
        const script = `
        bot = getBot(${this.index})
        if bot:isInWorld() and bot:getInventory():findItem(${this.item}) > 0 then
            bot:wear(${this.item})
            sleep(500)
        end
        `;
        try {
            const response = await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            console.log('Wear response:', response.data);
        } catch (error) {
            console.error('Error wearing item:', error);
        }
    }

    // Method to drop an item
    async drop() {
        const script = `
        bot = getBot(${this.index})
        if bot:isInWorld() and bot:getInventory():findItem(${this.item}) > 0 then
            bot:drop(${this.item}, bot:getInventory():findItem(${this.item}))
            sleep(500)
        end
        `;
        try {
            const response = await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            console.log('Drop response:', response.data);
        } catch (error) {
            console.error('Error dropping item:', error);
        }
    }
}

export default Interface;