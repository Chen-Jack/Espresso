
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
    static origin_target = null; //React reference to the source of the original Landable
    static active_target = null; //React reference to the active Landable

    static registerLandable = (ref)=>{
        Embassy.registeredLandables.push(ref)
    }

    static unregisterLandable = (ref)=>{
        /*
        This function takes a react reference
        Returns true on successful deletion. False when item is not in the array
        */
        for(let i in Embassy.registeredLandables){
            if(Embassy.registeredLandables[i] === ref){
                Embassy.registeredLandables.splice(i, 1)
                return true
            }
        }
        return false
    }

    static findTarget = (coordinates) => {
        for( let landable of Embassy.registeredLandables){
            if(landable.current.props.isGestureOnTop(coordinates)){
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
            Embassy.active_target.current.props.onStay()
        }
        else{
            // There is a target switch
            if(prev_target){
                prev_target.current.props.onLoseFocus()
            }
            if(new_target){
                new_target.current.props.onFocus()
            }
        }

        Embassy.active_target = new_target
        return Embassy.active_target
    }

    static findAndUpdateTarget = (coordinates) => {
        const new_target = Embassy.findTarget(coordinates)
        Embassy.updateTarget(new_target)
    }

    static addOnStartHandler = (handler) => {
        Embassy.onStartEvents.push(handler)
    }

    static addOnMoveHandler = (handler) => {
        Embassy.onMoveEvents.push(handler)
    }

    static addOnReleaseHandler = (handler) => {
        Embassy.onReleaseEvents.push(handler)
    }

    static onStartHandler = (coordinates)=>{
        /*
        The starting handler and active handler are always the same.
        Cause you havent moved away from the origin yet
        */

        for(let event of Embassy.onStartEvents){
            event()
        }

        //Disable scrolling on all landables while gesturing
        for(let landable of Embassy.registeredLandables){
            landable.current.props.toggleScroll(false)
        }

        const target = Embassy.findTarget(coordinates)
        Embassy.origin_target = target
        Embassy.updateTarget(target)
    }

    static onMoveHandler = (coordinates)=>{
        const new_target = Embassy.findTarget(coordinates)
        Embassy.updateTarget(new_target)


        for(let event of Embassy.onMoveEvents){
            event()
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
        source.current.props.removeItem()
        target.current.props.addItem()
    }

    static evaluteAndPerformTransferIfValid = (source ,target)=>{
        if(Embassy.canPerformTransfer(source,target)){
            Embassy.performTransfer(source,target)
        }
    }

    static onReleaseHandler = (coordinates)=>{
 
        const capturing_landable = Embassy.findTarget(coordinates)
        if(capturing_landable){
            capturing_landable.current.props.onHandleRelease()

            Embassy.evaluteAndPerformTransferIfValid(Embassy.origin_target, capturing_landable)
        }

        if(Embassy.active_target){
            Embassy.active_target.current.props.onLoseFocus()
            Embassy.active_target = null
        }
        
        Embassy.origin_target = null


        for(let event of Embassy.onReleaseEvents){
            event()
        }

        //Return scrolling capabilities to all landables
        for(let landable of Embassy.registeredLandables){
            landable.current.props.toggleScroll(false)
        }
    }
}