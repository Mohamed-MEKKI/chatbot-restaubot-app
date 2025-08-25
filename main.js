import express from "express";
import WhatsappBuisnessHandler from "./whatsapp-services/whatsappBuisnessHandler.js";
import {detectIntent} from "./utils/formatString.js";
import dotenv from "dotenv";
import MessageHandler from "./project-controller/messageController.js";
import PaiementHandler from "./project-controller/paiementStripe.js"
import ProjectController from "./project-controller/controller.js";


const messageType = {
    GREETINGS: "GREETINGS",
    ORDER: "ORDER",
    PAYMENT: "PAYMENT"
}

dotenv.config();

const app = express();
app.use(express.json());

const sendtext = new WhatsappBuisnessHandler()
const projectController = new ProjectController()
const messageIntent = new MessageHandler()

const PORT = process.env.PORT || 8888;


//Object.preventExtensions(person);

//Object.seal()

// Prevents any changes to an object
//Object.freeze(object)

app.get('/',(req,res)=>{
    res.send('Hello World! This is a WhatsApp webhook server.');
})

app.get('/webhook', async (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN 

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified!');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

app.post('/webhook', async (req, res) => {
    console.log("POST /webhook was called");
    try {
        const body = req.body;
        console.log("Received body:", body);
        res.status(200).send("EVENT_RECEIVED");
        // Log the full body for debugging
        console.log("Request body:", JSON.stringify(body, null, 2));


    /*
        const jsonfile =  {
                "user_id": 17,
                "name": name,
                "email": "haj@moussa",
                "password": "dlekdle@",
                "address": "laaouina",
                "image": "/media/profile.jpg",
                "phone":phoneNumber,
                "created_at": "2025-08-11T18:05:31.445111Z",
                "updated_at": "2025-08-11T18:05:31.445111Z"
                }
        
        const projectController = new ProjectController()
        projectController.createItem("user", jsonfile)
        console.log("user created")
    */
        if (body.object) {
            if (body.entry && body.entry[0].changes) {
                const change = body.entry[0].changes[0];
                const value = change.value;
                const message = value.messages && value.messages[0];
            
                
                        
            // Case: no message, but status event
            if (!message && value.statuses) {
                console.info(`Message status update: ${value.statuses[0].status}`);
                return;
            }

            // Case: no message at all
            if (!message) {
                console.warn("No message found in webhook");
                return;
            }

            const messageText = message.text && message.text.body;

            let messageToBeSend = ""

            const textReceived = detectIntent(messageText)

            /*let prod = {
                name: 'shoes', 
                description: 'Running shoes',
            }*/
           let product = {
                "name": "",
                "email": "oliver@outlook.fr",
                "address": "France",
                "phone": "",
                "items": "",
                "total": ""
            }

            //const paiementhandlers = new PaiementHandler(prod, 1000)
            let productName = ""


            switch(textReceived){

                case(messageType.GREETINGS):
                    const senderId = message.from;
                    console.log(`Received message from ${senderId}: ${messageText}`)
                    messageToBeSend = await messageIntent.greetingsHandler()
                    break;

                case(messageType.ORDER):
                    let customerPhoneNumber = value.contacts[0]?.wa_id 
                    let customerName =value.contacts[0]?.profile?.name
                    productName = await messageIntent.ordersHandler(messageText, customerName, customerPhoneNumber)
                    messageToBeSend = "Thank you for your order! To proceed with the payment, please type 'payment'."
                    break;
                
                case(messageType.PAYMENT):
                    const order = await projectController.getOneItem("order",id)
                    if (! order){
                        messageToBeSend = "You did not complete the order yet !"
                    }
                    const product = await messageIntent.findMenuItemByName("iced latte")
                    console.log(JSON.stringify(product,null,2))
                    const prod = {
                        name: product.name, 
                        description: product.description,
                    }
                    const paiementhandlers = new PaiementHandler(prod, parseInt(product.price)*100)
                    messageToBeSend = await paiementhandlers.getPaiementLink()
                    break;
                    
            }
            console.log(messageToBeSend)
            await sendtext.sendTextMessage(messageToBeSend, "18981982");
                
            }

            
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("Error in POST /webhook:", error);
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})