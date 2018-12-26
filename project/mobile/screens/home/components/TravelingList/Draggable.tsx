import Embassy from './Embassy'
import React from 'react'
import { Dimensions, Modal, View, PanResponder, Animated, PanResponderInstance, GestureResponderEvent, PanResponderGestureState} from 'react-native'
import { Coordinate } from '../../../../utility';
import { TaskCard } from '../TaskCard';
import { TaskList } from '../TaskList';

interface DraggableProps{
    source : TaskCard
    origin_list: TaskList
    doubleTapHandler : ()=>void
}

interface DraggableState{
    pan: Animated.ValueXY
    focus : boolean ,
    scale: Animated.Value
    modal_scale: Animated.Value
}

export default class Draggable extends React.Component<DraggableProps, DraggableState>{
    _panResponder : PanResponderInstance

    animation_speed : number
    time_of_last_press : number
    waiting_for_second_tap : boolean
    gesture_started: boolean  //a variable to know allow/know if the gesture has officially started

    draggable : React.RefObject<any>

    default_size : {
        width: number,
        height: number
    }

    initial_position : {
        x: number,
        y: number
    }

    ms_to_trigger_double_tap : number
    ms_to_trigger_long_press : number

    timer_ref : any //Ref to keep track of long press

    constructor(props : DraggableProps) {
        super(props)

        this.state = {
            pan: new Animated.ValueXY(),
            focus : false ,
            scale: new Animated.Value(0),
            modal_scale: new Animated.Value(1)
        }

        this.animation_speed = 500;
        
        this.time_of_last_press = Date.now();
        this.waiting_for_second_tap = false;
        this.ms_to_trigger_double_tap = 350;

        this.ms_to_trigger_long_press = 200; 
        this.timer_ref = null   
        this.gesture_started = false

        this.default_size = {width:0, height:0}
        this.initial_position = {x: 0, y: 0}

        this.draggable = React.createRef()



        this._panResponder = PanResponder.create({
            // onStartShouldSetResponder: (evt, gesture) => true,
            // onStartShouldSetResponderCapture: (evt,gesture)=> true,
            onStartShouldSetPanResponder : () => true,
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

            // onMoveShouldSetResponder: (evt, gestureState) => true,
            // onMoveShouldSetResponderCapture : (evt, gesture) => true,
            onMoveShouldSetPanResponder: () => true,
            // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (e, gestureState) => {
                e.persist() //Must persist event to access async
                const time_of_press = Date.now();


                if(this.waiting_for_second_tap){ 
                    if(time_of_press - this.time_of_last_press < this.ms_to_trigger_double_tap){
                        clearTimeout(this.timer_ref)
                        this.timer_ref = null
                       
                        this.waiting_for_second_tap = false;
                        this.props.doubleTapHandler()
                    }

                    this.time_of_last_press = time_of_press
                }
                else{   // First Tap
                    this.waiting_for_second_tap = true;
                    this.time_of_last_press = time_of_press
                }
                
                //Start timeout for long press
                this.timer_ref = setTimeout(  
                    this.long_press_callback.bind(this, e, gestureState), 
                    this.ms_to_trigger_long_press
                )
            },

            onPanResponderMove : ({nativeEvent}, gestureState) => {
                if(!this.gesture_started){
                    // If you move when you arent allowed to move yet, clear the timer
                    clearTimeout(this.timer_ref)
                    this.timer_ref = null
                }
                else{
                    const center_offset = {
                        x: this.default_size.width/2,
                        y: this.default_size.height/2
                    }
                    this.state.pan.setValue({
                        x: gestureState.moveX - center_offset.x, 
                        y: gestureState.moveY - center_offset.y
                    })

                    
                    const coordinates = {
                        x : nativeEvent.pageX,
                        y: nativeEvent.pageY
                    }
                    Embassy.onTravel(coordinates)
                    
 
                }
            },


            // onResponderTerminationRequest: (e,gesturestate) => {
            //     return false
            // },

            onPanResponderTerminationRequest: () => false,


            onPanResponderRelease: (e) => {
                if(!this.gesture_started){
                    //Released too early before actually starting gesture
                    clearTimeout(this.timer_ref)
                    this.timer_ref = null
                }
                else{
                    const coordinates : Coordinate = {
                        x : e.nativeEvent.pageX,
                        y: e.nativeEvent.pageY
                    } 
                    
                    Embassy.onFinishTraveling(coordinates, (final_destination)=>{
                        console.log("FINAL DESTINATION IS", final_destination);
                        const animation = this.getAnimationType(final_destination)
                        // animation && animation.start(()=>{
                            this.setState({
                                focus: false
                            }, ()=>{
                                this.state.pan.setValue({x: 0, y: 0});
                                this.state.pan.flattenOffset();
                            })
                        // })
                    })

                    // Animated.parallel([
                        // Animated.timing(                
                        //     this.state.modal_scale,         
                        //     {
                        //         toValue: 0,                 
                        //         duration: this.animation_speed,              
                        //     }
                        // ),
                        // Animated.timing(
                        //     this.state.pan,
                        //     {
                        //         toValue: this.initial_position,
                        //         duration: 500
                        //     }
                        // ),
                        // Animated.timing(
                        //     this.state.scale,
                        //     {
                        //         toValue: 1,
                        //         duration: this.animation_speed
                        //     }
                        // )
                    // ]).start(()=>{  
                    //     this.setState({
                    //         focus: false
                    //     }, ()=>{
                    //         this.state.pan.setValue({x: 0, y: 0});
                    //         this.state.pan.flattenOffset();
                    //     })
                    // })
                
                    this.gesture_started = false
                }
            }

          });
    }

    getAnimationType = (final_destination : number)=>{
        if(final_destination === Embassy.SAME_TARGET){
            console.log("back to square 1");
            return Animated.timing(
                this.state.pan,
                {
                    toValue: this.initial_position,
                    duration: this.animation_speed
                }
            )
        }
        else if(final_destination === Embassy.NEW_TARGET){
            console.log("time to shrink");
            return Animated.timing(
                this.state.scale,
                {
                    toValue: 0,
                    duration: this.animation_speed
                }
            )
        }
        else if(final_destination === Embassy.TARGET_LEFT){
            console.log("GO LEFTTT");
            this.initial_position.x = -1500
            return Animated.timing(
                this.state.pan,
                {
                    toValue: this.initial_position,
                    duration: this.animation_speed * 1.75
                }
            )
        }
        else if(final_destination === Embassy.TARGET_RIGHT){
            console.log("GOO RIGHHT");
            this.initial_position.x = 2000
            return Animated.timing(
                this.state.pan,
                {
                    toValue: this.initial_position,
                    duration: this.animation_speed * 1.75
                }
            )
        }
        else{
            console.log("Count not recognize the corresponding animation type for that target...");
        }
    }

    _onLayoutHandler = (e : any)=>{
        this.default_size = {
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height
        }
    }

    long_press_callback = (e : GestureResponderEvent, gestureState : PanResponderGestureState)=>{
        console.log("LONG PRESS ", e.nativeEvent, gestureState);

        this.draggable.current.measure(  
            (x : number, y: number, width : number, height : number, pageX: number, pageY: number) => {
            this.initial_position = {
                x: pageX,
                y: pageY
            };
        })
        
        this.setState({
            focus: true
        }, ()=>{
            Animated.parallel([
                Animated.spring(                
                    this.state.modal_scale,          
                    {
                        toValue: 1.1,                   
                        friction: 3, 
                    }
                ),
                Animated.spring(
                    this.state.scale,
                    {
                        toValue: 0,
                        friction: 3
                    }
                )
            ]).start()
        })

        const center_offset = {
            x: this.default_size.width/2,
            y: this.default_size.height/2
        }

        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value})
        this.state.pan.setValue({
            x: gestureState.x0 - center_offset.x,
            y: gestureState.y0 - center_offset.y
        });

    
        const coordinates = {
            x : e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        } as Coordinate

        Embassy.onStartTraveling(coordinates, this.props.source, /*this.props.origin_list*/)
        
        this.gesture_started = true
    }

    componentWillMount(){
        Animated.spring(                  // Animate over time
            this.state.scale,            // The animated value to drive
            {
              toValue: 1,                   // Animate to opacity: 1 (opaque)
              friction: 3
            }
          ).start();  
    }

    componentWillUnmount(){
        console.log("Draggable Unmounting");
    }

    render(){
        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let defaultSizeStyle =  {width: this.default_size.width, height: this.default_size.height}

        let translateStyle = {transform: [{translateX: this.state.pan.x}, {translateY: this.state.pan.y}]}
        let modalScaleStyle = {transform:[{scaleX: this.state.modal_scale}, {scaleY: this.state.modal_scale}]}


        let modalStyle = {transform: translateStyle.transform.concat(modalScaleStyle.transform)}
        let scaleStyle = {transform:[{scaleX: this.state.scale}, {scaleY: this.state.scale}]}
        return ( 
            <View ref= {this.draggable} {...this._panResponder.panHandlers} onLayout={this._onLayoutHandler}>

                <Modal
                    visible = {this.state.focus}
                    transparent = {true}>
                    <Animated.View style={[modalStyle, defaultSizeStyle]} >
                        {this.props.children}
                    </Animated.View>
                </Modal>

                
                <Animated.View style={[{opacity: this.state.focus ? 0 : 1}]}>
                    {this.props.children}
                </Animated.View>
            </View>)
    }
}
