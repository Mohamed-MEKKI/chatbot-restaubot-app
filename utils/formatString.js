

export const detectIntent = (message) => {
     
    let context = ""
    const texto = message.toLowerCase()
    if (!message){
        return 
    }
    if (/salem|bonjour|aaslema|hi|hello|salut/.test(texto))  context = "GREETINGS"
    else if (/order|commander|faire une commande|nheb nekmandi/.test(texto)) context = "ORDER"
    else if (/pay|payment|paiement|nkhalles/.test(texto)) context = "PAYMENT"
    else context = "TO_BE_DETERMINED_BY_AI"
    return context
} 

export function adjustResponse(response) {
            const extractData = response.match(/```([\s\S]*?)```/g);
            console.log("Extracted Data:", extractData);


            let cleanedString = extractData[0].replace(/```[\n]?/, "").replace(/```$/, "");

            // Parse the string into a proper JSON object
            let jsonData;
            try {
                jsonData = JSON.parse(cleanedString);
                console.log("Parsed JSON:", jsonData);
            } catch (err) {
                console.error("Failed to parse JSON:", err);
            }
            return jsonData;
        }


