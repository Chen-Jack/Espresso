/*
Interface Landable
isGestureOnTop
onGestureFocus
onGestureLoseFocus
onGestureStay
onHandleReleaseGesture
*/


export default class Embassy{
    /*
    I love shelly <3 doki doki :3 xD xP :T :p :P x3 83 ^__^ >__> >__< >x< owo o3o o-o O_O o.o o-O O-O Q_Q T-T T_T *_* ^-^ x_x @_@ 
    -_- n_n .___. (> ^^ )> .-. ~_~ 8D 8-D >:D :^) ^o^ u_u :) :o 8===D 
    A class to act as a middleman between all the landables. Not intended to be 
    instantiated. Every instantiated landable should let the Embassy know.
    */
    static registeredLandables = [];
    static onStartEvents = [];
    static onMoveEvents = [];
    static onReleaseEvents = [];
    static traveler = null;
    static origin_target = null; //React reference to the source of the original Landable
    static active_target = null; //React reference to the active Landable

    static registerLandable = (ref)=>{
        if(ref)
            Embassy.registeredLandables.push(ref)
    }

    static unregisterLandable = (ref)=>{
        /*
        This function takes a react reference
        Returns true on successful deletion. False when item is not in the array
        */
        if(ref === null)
            return true

        for(let i in Embassy.registeredLandables){
            if(Embassy.registeredLandables[i] === ref){
                Embassy.registeredLandables.splice(i, 1)
                return true
            }
        }
        return false
    }

    static getTraveler = ()=>{
        return Embassy.traveler
    }

    static findTarget = (coordinates) => {
        for( let landable of Embassy.registeredLandables){
            if(landable.isGestureOnTop(coordinates)){
                return landable
            }
        }
        return null
    }

    static updateTarget = (new_target) => {
        /*
        Updates the active target. The prev target then should lose focus, while
        the new target gains focus
        */
        const prev_target = Embassy.active_target
        if((prev_target === null) && (new_target === null)){
            //If nothing happened. No prev target, no new target
            return null
        }

        if(prev_target === new_target){
            // Target is still the same landable
            console.log("Same target");
            // Embassy.active_target.onGestureStay()
        }
        else{
            // There is a target switch
            console.log("SWITCH");
            if(prev_target){
                prev_target.onGestureLoseFocus()
            }
            if(new_target){
                console.log("new target", new_target);
                new_target.onGestureFocus()
            }
        }

        Embassy.active_target = new_target
        return Embassy.active_target
    }

    static findAndUpdateTarget = (coordinates) => {
        console.log("called");
        const new_target = Embassy.findTarget(coordinates)
        Embassy.updateTarget(new_target)
    }

    static addOnStartHandlers = (handlers) => {
        // All handlers must have two params, coordinates and a callback
        if(Array.isArray(handlers)){
            for(let func of handlers){
                Embassy.onStartEvents.push(func)
            }
        }
        else if(typeof handlers === "function"){
            Embassy.onStartEvents.push(handlers)
        }
        else{
            console.log("Incorrect handler passed into Embassy.addOnStartHandler");
        }
    }

    static addOnMoveHandlers = (handlers) => {
        
        if(Array.isArray(handlers)){
            for(let func of handlers){
                Embassy.onMoveEvents.push(func)
            }
        }
        else if(typeof handlers === "function"){
            Embassy.onMoveEvents.push(handlers)
        }
        else{
            console.log("Incorrect handler passed into Embassy.addOnMoveHandler");
        }
    }

    static addOnReleaseHandlers = (handlers) => {
        if(Array.isArray(handlers)){
            for(let func of handlers){
                Embassy.onReleaseEvents.push(func)
            }
        }
        else if(typeof handlers === "function"){
            Embassy.onReleaseEvents.push(handlers)
        }
        else{
            console.log("Incorrect handler passed into Embassy.addOnReleaseHandler");
        }
    }

    static onStartHandler = (coordinates, traveler)=>{
        /*
        The starting handler and active handler are always the same.
        Cause you havent moved away from the origin yet
        */

        Embassy.traveler = traveler
        console.log("TRAVELER IS", Embassy.traveler);

        const promises = Embassy.onStartEvents.map((evt)=>{
            return new Promise((resolve, reject) => {
                evt(coordinates, (err)=>{
                    if(err)
                        reject(err)
                    else
                        resolve()
                })
            });
        })

        Promise.all(promises).then(()=>{
            //Disable scrolling on all landables while gesturing

            const target = Embassy.findTarget(coordinates)
            Embassy.origin_target = target
           
            Embassy.updateTarget(target)
        }).catch((err)=>{
            console.log("ERROR WHEN USING EMBASSY's ONSTARTHANDLER", err);
        })

        
    }

    static onMoveHandler = (coordinates)=>{
        const new_target = Embassy.findTarget(coordinates)
        Embassy.updateTarget(new_target)

        for(let event of Embassy.onMoveEvents){
            event(coordinates)
        }
    }

    static canPerformTransfer = (source, target)=>{
        if( (source === null) || (target === null) || source === target){
            return false
        }
        else if( source !== target ){
            return true
        }
        else{
            //Just incase im missing some logic, default returns false
            return false
        }
    }

    static performTransfer = (source, target)=>{
        // source.props.removeItem()
        // target.props.addItem()
    }

    static evaluteAndPerformTransferIfValid = (source ,target)=>{
        if(Embassy.canPerformTransfer(source,target)){
            Embassy.performTransfer(source,target)
        }
    }

    static onReleaseHandler = (coordinates)=>{

        const capturing_landable = Embassy.findTarget(coordinates)
        if(capturing_landable){
            capturing_landable.onHandleReleaseGesture()

            // Embassy.evaluteAndPerformTransferIfValid(Embassy.origin_target, capturing_landable)
        }

        if(Embassy.active_target){
            Embassy.active_target.onGestureLoseFocus()
            Embassy.active_target = null
        }
        
        Embassy.origin_target = null
        Embassy.traveler = null
        
        for(let event of Embassy.onReleaseEvents){
            event(coordinates)
        }
    }
}