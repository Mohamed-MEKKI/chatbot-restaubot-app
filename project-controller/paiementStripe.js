import Stripe from "stripe"
import dotenv from "dotenv";

dotenv.config();

export default class paiementHandler{
    
    constructor(products, totalPrice){
        this.stripe = Stripe(process.env.STRIPE_APIKEY)
        this.products = products
        this.totalPrice = totalPrice
    }
    
    async defineProducts(){
        const productObject = this.products
        return await this.stripe.products.create(productObject);
    }
    

    async definePaiementDetails(){
        const products = await this.defineProducts()
        const unitAmount = this.totalPrice
        return await this.stripe.prices.create({
                    currency: 'usd',
                    unit_amount: unitAmount,
                    product: products.id,
                    });
                }
    
    async createPaiementLink(){
        const price = await this.definePaiementDetails('shoes')
        
        return  await this.stripe.paymentLinks.create({
            line_items: [
                {
                price: price.id,
                quantity: 1,
                },
            ],
            });

    }
 
    async getPaiementLink(){
        const paiementLinkGenerator = await this.createPaiementLink()
        if (paiementLinkGenerator && paiementLinkGenerator.url) {
            return paiementLinkGenerator.url.toString()
        } else {
            throw new Error("Payment link URL not found.")
        }
    }

}



