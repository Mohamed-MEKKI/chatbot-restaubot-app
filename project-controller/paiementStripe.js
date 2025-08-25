import Stripe from "stripe"

export default class paiementHandler{
    
    constructor(products, totalPrice){
        this.stripe = Stripe('sk_test_51RHPNdFs6smfAR6cv96lJOa1R6oKebaBghrJ4OB0NQyNtKcAhs283hfllD4FbBlpTX1nQ5rFLqkCnTOQ64QgQxyY00wVHGvL7k')
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



