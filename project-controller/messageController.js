import ProjectController from "../project-controller/controller.js";
import getLlamaResponse from "../ai-services/aiChatmodel.js";
import { paiementPrompt, reasoningPrompt, systemPrompt } from "../ai-services/definePrompts.js";
import { adjustResponse } from "../utils/formatString.js";




export default class MessageHandler extends ProjectController {
    constructor(){
        super()
        this.menu = []
    }

    /** Fetches all menu items and caches them */
    async getAvailableMenu(){
        this.menu = await this.getAllItems("menuitem") || []
        return this.menu
    }

      /**
     * Finds a menu item by name (case-insensitive)
     * @param {string} name
     * @returns {object|null}
     */
    async findMenuItemByName(name) {
        const menu = await this.getAvailableMenu();
        return menu.find(item => item.name.toLowerCase() === name.toLowerCase()) || null;
    }


    /** Handles greeting requests and returns AI-generated menu display */
    async greetingsHandler() {
        const menu = await this.getAvailableMenu();

        if (!menu.length) {
            console.warn("No menu items available");
            return "We are sorry :( No menu items available at the moment, please try again later.";
        }

        const menuPrompt = `Display the menu items in a user-friendly format:\n${JSON.stringify(menu, null, 2)}`;
        const llamaResp = await getLlamaResponse(systemPrompt, menuPrompt);

        if (!llamaResp) {
            throw new Error("Llama response is undefined or null");
        }

        return llamaResp;
    }

    /**
     * Handles orders by parsing AI response and creating order items
     * @param {string} name
     * @param {string} phoneNumber
     * @param {string} messageText
     * @returns {object|null}
     */
    async ordersHandler(messageText,name,phoneNumber){

        const response = await getLlamaResponse(reasoningPrompt, messageText)
        console.info("ai response",response)
        
        let jsonData = adjustResponse(response);

        const foundItem = await this.findMenuItemByName(jsonData.items[0]);

        /*if (!foundItem) {
            console.log("Item not found in the menu");
            return "We didn't find the requested item. Please pick another one"
        }*/

        let orderItems = {
                "name": name,
                "email": "oliver@outlook.fr",
                "address": "France",
                "phone": phoneNumber,
                "items": jsonData.items[0],
                "total": foundItem.price
            }

        this.createItem("order", orderItems)

    }

    /** Handles payment requests and returns AI response with a payment link */
    async paiementHandler(){

        const response = await getLlamaResponse(paiementPrompt)
        const paiementLink = await paiementhandlers.getPaiementLink()

        return `${response}\n\n${paiementLink}`;
    }
   
}