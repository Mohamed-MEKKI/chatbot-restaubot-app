import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


export default class DatabaseIneractionMethods {

    constructor() {

    }

    async createElementInTheDatabase(urlParam, formData) {
        try{
            const response = await axios.post(`http://127.0.0.1:8000/${urlParam}/create/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
        )
            return response.data
        }
        catch(error){
            console.error(error)
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            return []
        }
    }

    async getItemFromBackend(params, id) {
        try{
            const response = await axios.get(`http://127.0.0.1:8000/${params}/get/${id}`)
            return response.data
        }catch(error){
            console.error(error)
            console.log(error.response.status);
            console.log(error.response.headers);
            return []
        }
    }

    async getItemsFromBackend(urlParam) {
        const query = `http://127.0.0.1:8000/${urlParam}/get-all`
        console.log("Fetching data from:", query);
        try{
            const response = await axios.get(query)
            return response.data
        }catch(error){
            console.error(error)
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            return []
        }
    }

    async modifyItemDatabase (params, item_id, newStatus){
        try{
            const response = await axios.put(`http://127.0.0.1:8000/${params}/update/${item_id}`,{status:newStatus})
            return response.data
        }catch(error){
                console.error(error)
                console.log(error.response.status);
                console.log(error.response.headers);
                return []
            }
    }

    async deleteItemDatabase (params, item_id){
        try{
            const response = await axios.delete(`http://127.0.0.1:8000/${params}/delete/${item_id}`)
            return response.data
        }catch(error){
                console.error(error)
                console.log(error.response.status);
                console.log(error.response.headers);
                return []
            }
    }

    
}

