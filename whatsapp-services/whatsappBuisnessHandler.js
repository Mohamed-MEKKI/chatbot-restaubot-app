import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


export default class whatsappBuisnessHandler{

    constructor(){

    }

    async sendTextMessage(responseMessage, messageId) {
            console.log("Sending message to WhatsApp:", responseMessage);
            //const messageId = "1234567890"; // Replace with the actual message ID you want to use
            try{
                const response = await axios({
                url: process.env.WHATSAPP_API_URL,
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: process.env.WHATSAPP_PHONE_NUMBER,
                    type: 'text',
                    text:{
                        body: responseMessage
                    },
                    /*context: {
                        message_id: messageId
                    }*/
                })
            })
                console.log(response.data) 
        } catch (error) {
            throw Error('Error sending message:', error.response ? error.response.data : error.message)
        }

    }


    async receiveMessage(req, res) {
        console.log("Received message:", req.body);
        const body = req.body;
        if (body.object) {
            if (body.entry && body.entry[0].changes) {
                const change = body.entry[0].changes[0];
                const value = change.value;
                const message = value.messages && value.messages[0];
                
                if (message) {
                    const senderId = message.from;
                    const messageText = message.text && message.text.body;
                   
                    console.log(`Received message from ${senderId}: ${messageText}`);
                }
            }
            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
    }
    }