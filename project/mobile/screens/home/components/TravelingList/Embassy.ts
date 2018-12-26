import {ManagerContext} from './../../home'
import {Coordinate} from './../../../../utility'
import {TaskCard} from './../TaskCard'
import {Layout} from './../../../../utility'


export interface Focusable{
    onGestureLoseFocus : ()=>void,
    onGestureFocus  : ()=>void,
    onGestureStay : ()=>void,
    onHandleReleaseGesture : ()=>void,
}

export interface Transferable{
    getDate : () => string | null
}
export interface Landable{
    /*
    Is capable of capturing Travelable movements
    */
    getList : (coordinates : Coordinate)=> Focusable | null
    isGestureOnTop : (coordinates : Coordinate)=> boolean
    // getLayout : ()=> Layout
}


export interface Travelable{
    getID : ()=> string
}


export type Subscribeable = (coordinates : Coordinate , cb ?: (err ?: any)=>void )=>void


export default class Embassy{
    /*
    I love shelly <3 doki doki :3 xD xP :T :p :P x3 83 ^__^ >__> >__< >x< owo o3o o-o O_O o.o o-O O-O Q_Q T-T T_T *_* ^-^ x_x @_@ 
    -_- n_n .___. (> ^^ )> .-. ~_~ 8D >:D :^) ^o^ u_u :) :o owo uwu
    A class to act as a middleman between all the landables. Not intended to be 
    instantiated. Every instantiated landable should let the Embassy know.
    */
    static SAME_TARGET = 0
    static NEW_TARGET = 1
    static TARGET_LEFT = 2
    static TARGET_RIGHT = 3

    static manager : ManagerContext;

    static registeredLandables : Landable[] = []; //Can either be a TaskList, or a container containing TaskLists
    static onStartEvents : Subscribeable[] = [];
    static onMoveEvents : Subscribeable[]  = [];
    static onReleaseEvents : Subscribeable[] = [];

    static traveler : any = null;
    static traveler_origin_list : Focusable | null;

    static active_list : Focusable | null; //React reference to the active TaskList

    static carousel_offset = 0  // Keeps track of how many times the carousel has turned since the gesture started.

    static setManager = (manager : ManagerContext)=>{
        Embassy.manager = manager;
    }

    static carouselTurn(turn : number){
        /*
        Intended to be called when the carousel rotates when the card is over the edge of the carousel.
        */
        Embassy.carousel_offset += turn
    }

    static resetTravelDetails = ()=>{
        /*
        Clears all the Embassy's variables
        */
        Embassy.setStartingDetails(null,null)
        Embassy.carousel_offset = 0

        if(Embassy.active_list){
            Embassy.active_list.onGestureLoseFocus()
            Embassy.active_list = null;
        }
    }
    static setStartingDetails = (traveler : Travelable | null, origin : Focusable | null)=>{
        /*
        On the start of a gesture, the travelable and it's origin should be registered.
        */
        Embassy.traveler = traveler
        Embassy.traveler_origin_list = origin
    }
    static getTraveler = ()=>{
        return Embassy.traveler
    }
    static registerLandable = (ref : Landable)=>{
        if(ref){
            Embassy.registeredLandables.push(ref)
        }

    }
    static unregisterLandable = (ref : Landable)=>{
        /*
        This function takes a react reference
        Returns true on successful deletion. False when item is not in the array
        */
        if(ref === null)
            return true

        for(let i =0; i<Embassy.registeredLandables.length; i++){
            if(Embassy.registeredLandables[i] === ref){
                Embassy.registeredLandables.splice(i, 1)
                return true
            }
        }
        return false
    }

    static addOnStartHandlers = (handlers : Subscribeable[] | Subscribeable) => {
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
    static addOnMoveHandlers = (handlers : Subscribeable[] | Subscribeable) => {
        
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
    static addOnReleaseHandlers = (handlers : Subscribeable[] | Subscribeable) => {
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

    static removeOnReleaseHandlers = (handlers: Subscribeable[] | Subscribeable)=>{
        if(Array.isArray(handlers)){
            for(let handler of handlers){
                Embassy.onReleaseEvents.forEach((func, index)=>{
                    if(func === handler){
                        Embassy.onReleaseEvents.splice(index, 1)
                    }
                })
            }
        }
        else if(typeof handlers === "function"){
            Embassy.onReleaseEvents.forEach((func, index)=>{
                if(func === handlers){
                    Embassy.onReleaseEvents.splice(index, 1)
                    console.log("Successfully removed event", Embassy.onReleaseEvents);
                    return
                }
            })
        }
        else{
            console.log("Incorrect handler passed into Embassy.removeOnReleaseHandler");
        }
    }

    static removeOnStartHandlers = (handlers: Subscribeable[] | Subscribeable)=>{
        if(Array.isArray(handlers)){
            for(let handler of handlers){
                Embassy.onStartEvents.forEach((func, index)=>{
                    if(func === handler){
                        Embassy.onStartEvents.splice(index, 1)
                    }
                })
            }
        }
        else if(typeof handlers === "function"){
            Embassy.onStartEvents.forEach((func, index)=>{
                if(func === handlers){
                    Embassy.onStartEvents.splice(index, 1)
                    console.log("Successfully removed event", Embassy.onReleaseEvents);
                    return
                }
            })
        }
        else{
            console.log("Incorrect handler passed into Embassy.removeOnReleaseHandler");
        }
    }


    static findList = (coordinates : Coordinate) => {
        /*
        Gets a reference to a focusable that the gesture is ontop of.
        */
        const landable = Embassy.findLandable(coordinates)
        if(landable)
            return landable.getList(coordinates)
        else
            return null
    }

    static findLandable = (coordinates: Coordinate)=>{
        for( let landable of Embassy.registeredLandables){
            if(landable.isGestureOnTop(coordinates)){
                return landable
            }
        }
        return null
    }

    static setActiveList = (new_list : Focusable | null) => {
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
            Embassy.active_list && Embassy.active_list.onGestureStay()
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

    static ghostTraveler = ()=>{
        // Makes the traveler lower opacity
        Embassy.getTraveler().ghost()
    }

    static materializeTraveler = ()=>{
        // Makes the traveler normal opacity
        Embassy.getTraveler().materialize()
    }

    static onStartTraveling = (coordinates : Coordinate, traveler : TaskCard)=>{
        /*
        Should be called by the draggable that initates the travel
        The traveler and the origin_list are the references to the
        card that started the gesture.
        Traveler_task_list is the tasklist the traveler comes from.
        */
  
        const origin_list = Embassy.findList(coordinates)
        // console.log("ORIGIN LIST IS", origin_list);
        Embassy.setActiveList(origin_list)
        Embassy.setStartingDetails(traveler, origin_list)


        console.log("a total of", Embassy.onStartEvents.length);
        for(let event of Embassy.onStartEvents){
            event(coordinates)
        }
    }
    static onTravel = (coordinates : Coordinate)=>{
        /*
        Call back to only be used by the traveling Draggable
        */
        const new_target = Embassy.findList(coordinates)
        Embassy.setActiveList(new_target)

        for(let event of Embassy.onMoveEvents){
            event(coordinates)
        }
    }

    static onFinishTraveling = (coordinates : Coordinate, cb : (final_destination : any )=>void )=>{
        /*
        The cb is how the draggable should move in relation to what it is released on top of.
        */
        const landable = Embassy.findLandable(coordinates)
        const final_target_list = landable && landable.getList(coordinates) as Transferable & Focusable
        
        // Determine which case is the finish.
        /*
        i) Directly on new target
        ii) New target is the same as the origin
        iii) No new target, origin was a carousel
            a) no new target, origin is off screen(right side)
            b) no new target, origin is off screen (left side)
            c) No new target, origin is still on screen
        
        iv) No new target, origin was a drawer
            Covered by case iii a, this is done by having the drawer auto open.
        */
       
        if(final_target_list !== null && (final_target_list !== Embassy.traveler_origin_list))
            // case i
            cb(Embassy.NEW_TARGET)
        else if(final_target_list !== null && (final_target_list === Embassy.traveler_origin_list ))
            // case ii
            cb(Embassy.SAME_TARGET)
        else if(final_target_list === null){
            //case iii a-c
            if(Embassy.carousel_offset >= 1){
                // case a
                cb(Embassy.TARGET_LEFT)
            }
            else if(Embassy.carousel_offset <= -1){
                // case b
                cb(Embassy.TARGET_RIGHT)
            }
            else{
                // case c
                cb(Embassy.SAME_TARGET)
            }
        }
        


        if(landable){
            if(final_target_list){
                final_target_list.onHandleReleaseGesture()
            }
            
            Embassy.performTransfer(final_target_list)
          
        }

          
        for(let event of Embassy.onReleaseEvents){
            event(coordinates)
        }

        Embassy.resetTravelDetails();
    }


    static performTransfer = (target : Transferable | null)=>{
        /*
            Transfers the contents from the traveler's origin to the 
            target
        */
    //    console.log("Traveler is", Embassy.getTraveler());
        const old_target = Embassy.traveler_origin_list as Transferable | null

       const task_id = Embassy.getTraveler().getID()
    //    const old_list_date = old_target && old_target.getDate()
        const old_list_date = Embassy.getTraveler().getDate()
       const new_list_date = target ? target.getDate() : null
       if(!target) console.log("Could not find target");

       console.log("Transfering", task_id, old_list_date, "--->", new_list_date);

       if(new_list_date === null){
        //Deallocate
            console.log("Deallocating");
            // Embassy.manager.deallocateTask(task_id)
       }
       else if( !old_list_date && new_list_date){
           //Allocating
            console.log("Allocating");
            Embassy.manager.allocateTask(task_id, new_list_date)
       }
       else if( (old_list_date && new_list_date) &&
        (old_list_date !== new_list_date)){
            //Reallocating
            Embassy.manager.reallocateTask(task_id, new_list_date)
        }   
    }    
}