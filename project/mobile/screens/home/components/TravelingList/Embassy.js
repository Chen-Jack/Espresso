/*
Interface Landable
isGestureOnTop
onGestureFocus
onGestureLoseFocus
onGestureStay
onHandleReleaseGesture

TSAK LSIT MUST IMPLEMENT
onGestureLoseFocus
onGestureFocus 
onGestureStay
onHandleReleaseGesture

IF TASK LIST CONTAINER, MUST IMPLEMENT
getList()
isGestureOnTop()

all subscribled events must have (coordinates) as their parameters

*/
import TaskList from './../TaskCarousel/TaskList'

export default class Embassy{
    /*
    I love shelly <3 doki doki :3 xD xP :T :p :P x3 83 ^__^ >__> >__< >x< owo o3o o-o O_O o.o o-O O-O Q_Q T-T T_T *_* ^-^ x_x @_@ 
    -_- n_n .___. (> ^^ )> .-. ~_~ 8D 8-D >:D :^) ^o^ u_u :) :o 8===D 
    A class to act as a middleman between all the landables. Not intended to be 
    instantiated. Every instantiated landable should let the Embassy know.
    */
    static registeredLandables = []; //Can either be a TaskList, or a container containing TaskLists
    static onStartEvents = [];
    static onMoveEvents = [];
    static onReleaseEvents = [];

    static traveler = null;
    static traveler_origin_list = null;

    // static original_list = null; //React reference to the source of the original Landable
    static active_list = null; //React reference to the active Landable

    static resetTravelDetails = ()=>{
        /*
        Clears all the Embassy's variables
        */
        Embassy.setStartingDetails(null,null)
        if(Embassy.active_list){
            Embassy.active_list.onGestureLoseFocus()
            Embassy.active_list = null;
        }
    }
    static setStartingDetails = (traveler, origin)=>{
        Embassy.traveler = traveler
        Embassy.traveler_origin_list = origin
    }
    static getTraveler = ()=>{
        return Embassy.traveler
    }
    static registerLandable = (ref)=>{
        if(ref){
            Embassy.registeredLandables.push(ref)
        }

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
    static findList = (coordinates) => {
        /*
        Gets a reference of the TaskList that the gesture is ontop of.
        */
        for( let landable of Embassy.registeredLandables){
            if(landable.isGestureOnTop(coordinates)){
                if(landable instanceof TaskList)
                    return landable
                else
                    return landable.getList()
            }
        }
        return null
    }
    static setActiveList = (new_list) => {
        /*
        Updates the current list that the traveler is on top of. 
        The prev target then should lose focus, while the new target gains focus.
        */
        const prev_list = Embassy.active_list
        if((prev_list === null) && (new_list === null)){
            //If nothing happened. No prev target, no new target
            return null
        }

        if(prev_list === new_list){
            // Target is still the same landable
            Embassy.active_list.onGestureStay()
        }
        else{
            // There is a target switch
            if(prev_list){
                prev_list.onGestureLoseFocus()
            }
            if(new_list){
                new_list.onGestureFocus()
            }
        }

        Embassy.active_list = new_list
        return Embassy.active_list
    }
    static onStartTraveling = (coordinates, traveler, origin_list)=>{
        /*
        Should be called by the draggable that initates the travel
        The traveler and the origin_list are the references to the
        card that started the gesture.
        Traveler_task_list is the tasklist the traveler comes from.
        */
      
        Embassy.setStartingDetails(traveler, origin_list)
        Embassy.setActiveList(origin_list)

        // const promises = Embassy.onStartEvents.map((evt)=>{
        //     return new Promise((resolve, reject) => {
        //         evt(coordinates, (err)=>{
        //             if(err){
        //                 reject(err)
        //             }
        //             else{
        //                 resolve()
        //             }
        //         })
        //     });
        // })

        for(let event of Embassy.onStartEvents){
            event(coordinates)
        }
    }

    static onTravel = (coordinates)=>{
        /*
        Call back to only be used by the traveling Draggable
        */
        const new_target = Embassy.findList(coordinates)
        Embassy.setActiveList(new_target)

        for(let event of Embassy.onMoveEvents){
            event(coordinates)
        }
    }

    static onFinishTraveling = (coordinates)=>{
        const final_target_list = Embassy.findList(coordinates)
        if(final_target_list){
            final_target_list.onHandleReleaseGesture()
            // Embassy.evaluteAndPerformTransferIfValid(Embassy.origin_target, capturing_landable)
        }
        
        for(let event of Embassy.onReleaseEvents){
            event(coordinates)
        }

        Embassy.resetTravelDetails();
    }

    // static canPerformTransfer = (source, target)=>{
    //     if( (source === null) || (target === null) || source === target){
    //         return false
    //     }
    //     else if( source !== target ){
    //         return true
    //     }
    //     else{
    //         //Just incase im missing some logic, default returns false
    //         return false
    //     }
    // }

    // static performTransfer = (source, target)=>{
    //     // source.props.removeItem()
    //     // target.props.addItem()
    // }

    // static evaluteAndPerformTransferIfValid = (source ,target)=>{
    //     if(Embassy.canPerformTransfer(source,target)){
    //         Embassy.performTransfer(source,target)
    //     }
    // }

    
}