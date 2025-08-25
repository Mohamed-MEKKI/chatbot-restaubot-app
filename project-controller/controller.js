import DatabaseIneractionMethods from "../databases/databaseInteraction.js"



export default class ProjectController extends DatabaseIneractionMethods {
    
    constructor() {
        super()
    }

    async createItem(urlParam, formData) {
        return await this.createElementInTheDatabase(urlParam, formData)
    }

    async getAllItems(urlParam) {
        return await this.getItemsFromBackend(urlParam)
    }

    async getOneItem(urlParam, id){
        return await this.getItemFromBackend(urlParam, id)
    }


}

