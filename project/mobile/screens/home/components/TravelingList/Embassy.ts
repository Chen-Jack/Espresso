import {TaskList} from './../TaskList'
import {ManagerContext} from './../../home'
import {Coordinate} from './../../../../utility'
import {TaskCard} from './../TaskCard'


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
    getList : ()=> Focusable | null
    isGestureOnTop : (coordinates : Coordinate)=> boolean
}


export interface Travelable{
    getID : ()=> string
}


export type Subscribeable = (coordinates : Coordinate , cb ?: (err ?: any)=>void )=>void


export default class Embassy{
    /*
    I love shelly <3 doki doki :3 xD xP :T :p :P x3 83 ^__^ >__> >__< >x< owo o3o o-o O_O o.o o-O O-O Q_Q T-T T_T *_* ^-^ x_x @_@ 
    -_- n_n .___. (> ^^ )> .-. ~_~ 8D 8-D >:D :^) ^o^ u_u :) :o 8===D 
    A class to act as a middleman between all the landables. Not intended to be 
    instantiated. Every instantiated landable should let the Embassy know.
    */
    static manager : ManagerContext;

    static registeredLandables : Landable[] = []; //Can either be a TaskList, or a container containing TaskLists
    static onStartEvents : Subscribeable[] = [];
    static onMoveEvents : Subscribeable[]  = [];
    static onReleaseEvents : Subscribeable[] = [];

    static traveler : any = null;
    static traveler_origin_list : Focusable | null;

    static active_list : Focusable | null; //React reference to the active TaskList

    static setManager = (manager : ManagerContext)=>{
        Embassy.manager = manager;
    }

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
    static findList = (coordinates : Coordinate) => {
        /*
        Gets a reference to a focusable that the gesture is ontop of.
        */
        for( let landable of Embassy.registeredLandables){
            if(landable.isGestureOnTop(coordinates)){
                return landable.getList()
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

    static onStartTraveling = (coordinates : Coordinate, traveler : TaskCard, origin_list : Focusable)=>{
        /*
        Should be called by the draggable that initates the travel
        The traveler and the origin_list are the references to the
        card that started the gesture.
        Traveler_task_list is the tasklist the traveler comes from.
        */
      
        console.log("Hm", Embassy.manager);
        Embassy.setStartingDetails(traveler, origin_list)
        Embassy.setActiveList(origin_list)


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

    static onFinishTraveling = (coordinates : Coordinate)=>{
        const final_target_list = Embassy.findList(coordinates) as Transferable & Focusable
        if(final_target_list){
            final_target_list.onHandleReleaseGesture()
        }
        
        Embassy.performTransfer(final_target_list)
        
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