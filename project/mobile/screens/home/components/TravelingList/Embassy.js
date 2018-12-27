"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Embassy = /** @class */ (function () {
    function Embassy() {
    }
    Embassy.carouselTurn = function (turn) {
        /*
        Intended to be called when the carousel rotates when the card is over the edge of the carousel.
        */
        Embassy.carousel_offset += turn;
    };
    /*
    I love shelly <3 doki doki :3 xD xP :T :p :P x3 83 ^__^ >__> >__< >x< owo o3o o-o O_O o.o o-O O-O Q_Q T-T T_T *_* ^-^ x_x @_@
    -_- n_n .___. (> ^^ )> .-. ~_~ 8D >:D :^) ^o^ u_u :) :o owo uwu
    A class to act as a middleman between all the landables. Not intended to be
    instantiated. Every instantiated landable should let the Embassy know.
    */
    Embassy.SAME_TARGET = 0;
    Embassy.NEW_TARGET = 1;
    Embassy.TARGET_LEFT = 2;
    Embassy.TARGET_RIGHT = 3;
    Embassy.registeredLandables = []; //Can either be a TaskList, or a container containing TaskLists
    Embassy.onStartEvents = [];
    Embassy.onMoveEvents = [];
    Embassy.onReleaseEvents = [];
    Embassy.traveler = null;
    Embassy.carousel_offset = 0; // Keeps track of how many times the carousel has turned since the gesture started.
    Embassy.setManager = function (manager) {
        Embassy.manager = manager;
    };
    Embassy.resetTravelDetails = function () {
        /*
        Clears all the Embassy's variables
        */
        Embassy.setStartingDetails(null, null);
        Embassy.carousel_offset = 0;
        if (Embassy.active_list) {
            Embassy.active_list.onGestureLoseFocus();
            Embassy.active_list = null;
        }
    };
    Embassy.setStartingDetails = function (traveler, origin) {
        /*
        On the start of a gesture, the travelable and it's origin should be registered.
        */
        Embassy.traveler = traveler;
        Embassy.traveler_origin_list = origin;
    };
    Embassy.getTraveler = function () {
        return Embassy.traveler;
    };
    Embassy.registerLandable = function (ref) {
        if (ref) {
            Embassy.registeredLandables.push(ref);
        }
    };
    Embassy.unregisterLandable = function (ref) {
        /*
        This function takes a react reference
        Returns true on successful deletion. False when item is not in the array
        */
        if (ref === null)
            return true;
        for (var i = 0; i < Embassy.registeredLandables.length; i++) {
            if (Embassy.registeredLandables[i] === ref) {
                Embassy.registeredLandables.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    Embassy.addOnStartHandlers = function (handlers) {
        // All handlers must have two params, coordinates and a callback
        if (Array.isArray(handlers)) {
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                var func = handlers_1[_i];
                Embassy.onStartEvents.push(func);
            }
        }
        else if (typeof handlers === "function") {
            Embassy.onStartEvents.push(handlers);
        }
        else {
            console.log("Incorrect handler passed into Embassy.addOnStartHandler");
        }
    };
    Embassy.addOnMoveHandlers = function (handlers) {
        if (Array.isArray(handlers)) {
            for (var _i = 0, handlers_2 = handlers; _i < handlers_2.length; _i++) {
                var func = handlers_2[_i];
                Embassy.onMoveEvents.push(func);
            }
        }
        else if (typeof handlers === "function") {
            Embassy.onMoveEvents.push(handlers);
        }
        else {
            console.log("Incorrect handler passed into Embassy.addOnMoveHandler");
        }
    };
    Embassy.addOnReleaseHandlers = function (handlers) {
        if (Array.isArray(handlers)) {
            for (var _i = 0, handlers_3 = handlers; _i < handlers_3.length; _i++) {
                var func = handlers_3[_i];
                Embassy.onReleaseEvents.push(func);
            }
        }
        else if (typeof handlers === "function") {
            Embassy.onReleaseEvents.push(handlers);
        }
        else {
            console.log("Incorrect handler passed into Embassy.addOnReleaseHandler");
        }
    };
    Embassy.removeOnReleaseHandlers = function (handlers) {
        if (Array.isArray(handlers)) {
            var _loop_1 = function (handler) {
                Embassy.onReleaseEvents.forEach(function (func, index) {
                    if (func === handler) {
                        Embassy.onReleaseEvents.splice(index, 1);
                    }
                });
            };
            for (var _i = 0, handlers_4 = handlers; _i < handlers_4.length; _i++) {
                var handler = handlers_4[_i];
                _loop_1(handler);
            }
        }
        else if (typeof handlers === "function") {
            Embassy.onReleaseEvents.forEach(function (func, index) {
                if (func === handlers) {
                    Embassy.onReleaseEvents.splice(index, 1);
                    console.log("Successfully removed event", Embassy.onReleaseEvents);
                    return;
                }
            });
        }
        else {
            console.log("Incorrect handler passed into Embassy.removeOnReleaseHandler");
        }
    };
    Embassy.removeOnStartHandlers = function (handlers) {
        if (Array.isArray(handlers)) {
            var _loop_2 = function (handler) {
                Embassy.onStartEvents.forEach(function (func, index) {
                    if (func === handler) {
                        Embassy.onStartEvents.splice(index, 1);
                    }
                });
            };
            for (var _i = 0, handlers_5 = handlers; _i < handlers_5.length; _i++) {
                var handler = handlers_5[_i];
                _loop_2(handler);
            }
        }
        else if (typeof handlers === "function") {
            Embassy.onStartEvents.forEach(function (func, index) {
                if (func === handlers) {
                    Embassy.onStartEvents.splice(index, 1);
                    console.log("Successfully removed event", Embassy.onReleaseEvents);
                    return;
                }
            });
        }
        else {
            console.log("Incorrect handler passed into Embassy.removeOnReleaseHandler");
        }
    };
    Embassy.findList = function (coordinates) {
        /*
        Gets a reference to a focusable that the gesture is ontop of.
        */
        var landable = Embassy.findLandable(coordinates);
        if (landable)
            return landable.getList(coordinates);
        else
            return null;
    };
    Embassy.findLandable = function (coordinates) {
        for (var _i = 0, _a = Embassy.registeredLandables; _i < _a.length; _i++) {
            var landable = _a[_i];
            if (landable.isGestureOnTop(coordinates)) {
                return landable;
            }
        }
        return null;
    };
    Embassy.setActiveList = function (new_list) {
        /*
        Updates the current list that the traveler is on top of.
        The prev target then should lose focus, while the new target gains focus.
        */
        var prev_list = Embassy.active_list;
        if ((prev_list === null) && (new_list === null)) {
            //If nothing happened. No prev target, no new target
            return null;
        }
        if (prev_list === new_list) {
            // Target is still the same landable
            Embassy.active_list && Embassy.active_list.onGestureStay();
        }
        else {
            // There is a target switch
            if (prev_list) {
                prev_list.onGestureLoseFocus();
            }
            if (new_list) {
                new_list.onGestureFocus();
            }
        }
        Embassy.active_list = new_list;
        return Embassy.active_list;
    };
    Embassy.ghostTraveler = function () {
        // Makes the traveler lower opacity
        var traveler = Embassy.getTraveler();
        traveler && traveler.ghost();
    };
    Embassy.materializeTraveler = function () {
        // Makes the traveler normal opacity
        var traveler = Embassy.getTraveler();
        traveler && traveler.materialize();
    };
    Embassy.onStartTraveling = function (coordinates, traveler) {
        /*
        Should be called by the draggable that initates the travel
        The traveler and the origin_list are the references to the
        card that started the gesture.
        Traveler_task_list is the tasklist the traveler comes from.
        */
        var origin_list = Embassy.findList(coordinates);
        // console.log("ORIGIN LIST IS", origin_list);
        Embassy.setActiveList(origin_list);
        Embassy.setStartingDetails(traveler, origin_list);
        console.log("a total of", Embassy.onStartEvents.length);
        for (var _i = 0, _a = Embassy.onStartEvents; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            event_1(coordinates);
        }
    };
    Embassy.onTravel = function (coordinates) {
        /*
        Call back to only be used by the traveling Draggable
        */
        var new_target = Embassy.findList(coordinates);
        Embassy.setActiveList(new_target);
        for (var _i = 0, _a = Embassy.onMoveEvents; _i < _a.length; _i++) {
            var event_2 = _a[_i];
            event_2(coordinates);
        }
    };
    Embassy.onFinishTraveling = function (coordinates, cb) {
        /*
        The cb is how the draggable should move in relation to what it is released on top of.
        */
        var landable = Embassy.findLandable(coordinates);
        var final_target_list = landable && landable.getList(coordinates);
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
        if (final_target_list !== null && (final_target_list !== Embassy.traveler_origin_list))
            // case i
            cb(Embassy.NEW_TARGET);
        else if (final_target_list !== null && (final_target_list === Embassy.traveler_origin_list))
            // case ii
            cb(Embassy.SAME_TARGET);
        else if (final_target_list === null) {
            //case iii a-c
            if (Embassy.carousel_offset >= 1) {
                // case a
                cb(Embassy.TARGET_LEFT);
            }
            else if (Embassy.carousel_offset <= -1) {
                // case b
                cb(Embassy.TARGET_RIGHT);
            }
            else {
                // case c
                cb(Embassy.SAME_TARGET);
            }
        }
        if (landable) {
            if (final_target_list) {
                final_target_list.onHandleReleaseGesture();
            }
            Embassy.performTransfer(final_target_list);
        }
        for (var _i = 0, _a = Embassy.onReleaseEvents; _i < _a.length; _i++) {
            var event_3 = _a[_i];
            event_3(coordinates);
        }
        Embassy.resetTravelDetails();
    };
    Embassy.performTransfer = function (target) {
        /*
            Transfers the contents from the traveler's origin to the
            target
        */
        //    console.log("Traveler is", Embassy.getTraveler());
        var old_target = Embassy.traveler_origin_list;
        var task_id = Embassy.getTraveler().getID();
        //    const old_list_date = old_target && old_target.getDate()
        var old_list_date = Embassy.getTraveler().getDate();
        var new_list_date = target ? target.getDate() : null;
        if (!target)
            console.log("Could not find target");
        console.log("Transfering", task_id, old_list_date, "--->", new_list_date);
        if (new_list_date === null) {
            //Deallocate
            console.log("Deallocating");
            // Embassy.manager.deallocateTask(task_id)
        }
        else if (!old_list_date && new_list_date) {
            //Allocating
            console.log("Allocating");
            Embassy.manager.allocateTask(task_id, new_list_date);
        }
        else if ((old_list_date && new_list_date) &&
            (old_list_date !== new_list_date)) {
            //Reallocating
            Embassy.manager.reallocateTask(task_id, new_list_date);
        }
    };
    return Embassy;
}());
exports.default = Embassy;
