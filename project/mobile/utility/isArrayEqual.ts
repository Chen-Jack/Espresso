import isObjectEqual from './isObjectEqual'

export default function isArrayEqual(a: any,b:any){
    console.log("Comparing arrays", a,b);
    // Checks if the contents of two arrays are the same, and in the same order
    if(!Array.isArray(a) || !Array.isArray(b))
        return false

    if(a.length !== b.length)
        return false

    for(let i =0; i<a.length; i++){
        const item_a = a[i]
        const item_b = b[i]

        if(typeof item_a !== typeof item_b)
            return false

        // if the value is an array, recursively check again
        if(Array.isArray(item_a) && Array.isArray(item_b)){
            if (!isArrayEqual(item_a,item_b))
                return false
        }

        // if the value is an object
        else if(typeof item_a === "object" && typeof item_b === "object"){
            if(!isObjectEqual(item_a, item_b))
                return false
        }

        // Otherwise, you are likely to be comparing primatives, check if equivalent
        else{
            if(item_a !== item_b)
                return false
        }

    }

    return true   
}