import isArrayEqual from './isArrayEqual'

export default function isObjectEqual(a:any,b:any){
    // Checks if two objects have the exact same key value pair, but not 
    // necessarily the same object reference
    if(typeof a !== "object" || typeof b!=='object')
        return false

    const a_keys = Object.keys(a)
    const b_keys = Object.keys(b)

    if(a_keys.length !== b_keys.length)
        return false

    for (let key of a_keys){
        // Compare Each Key value pair
        const item_a = a[key]
        const item_b = b[key]
        if(typeof item_a !== typeof item_b)
            return false

        console.log("Comp", item_a, item_b);
        // if the value is an array, check if the arrays are equal
        if(Array.isArray(item_a) && Array.isArray(item_b)){
            if (!isArrayEqual(item_a, item_b))
                return false
        }

        // if the value is an object, recursively check again
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