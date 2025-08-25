
export const computeSum = (object) => {
    let sum = 0

    if (!object){
        throw TypeError("object is invalid, please submit an array of json objects")
    }
    
    if (object.length === 0){
        sum = 0
    }
    object.forEach(element => {
        sum = sum + element.price
    });
    return sum;
}

