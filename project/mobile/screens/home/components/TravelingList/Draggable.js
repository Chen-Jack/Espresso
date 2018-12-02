import Embassy from './Embassy'
import React from 'react'
import ReactNative, { Modal, View, Text, TouchableHighlight, PanResponder, Animated, FlatList, Dimensions} from 'react-native'
import PropTypes from 'prop-types'

export default class Draggable extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            pan: new Animated.ValueXY(),
            focus : false ,
            scale: new Animated.Value(0), //Start initial scale as 0,
            modal_scale: new Animated.Value(1)
        }

        this.animation_speed = 350;
        
        this.time_of_last_press = Date.now();
        this.waiting_for_second_tap = false;
        this.ms_to_trigger_double_tap = 350;

        this.ms_to_trigger_long_press = 200; 
        this.timer_ref = null   //Ref to keep track of long press
        this.gesture_started = false //a variable to know allow/know if the gesture has officially started

        this.default_size = {width:0, height:0}
    }

    _onLayoutHandler = (e)=>{
        this.default_size = {
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height
        }
    }

    long_press_callback = (e, gestureState)=>{
            
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
        }

        Embassy.onStartTraveling(coordinates, this.props.source, this.props.origin_list)
        
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

        this._panResponder = PanResponder.create({
            onStartShouldSetResponder: (evt, gesture) => true,
            // onStartShouldSetResponderCapture: (evt,gesture)=> true,
            onStartShouldSetPanResponder : (evt, gesture) => true,
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

            onMoveShouldSetResponder: (evt, gestureState) => true,
            // onMoveShouldSetResponderCapture : (evt, gesture) => true,
            onMoveShouldSetPanResponder: (evt,gestureState) => true,
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


            onResponderTerminationRequest: (e,gesturestate) => {
                return false
            },

            onPanResponderTerminationRequest: (evt, gestureState) => false,


            onPanResponderRelease: (e, gestureState) => {
                if(!this.gesture_started){
                    //Released too early before actually starting gesture
                    clearTimeout(this.timer_ref)
                    this.timer_ref = null
                }
                else{
                    Animated.parallel([
                        Animated.timing(                
                            this.state.modal_scale,         
                            {
                                toValue: 0,                 
                                duration: this.animation_speed,              
                            }
                        ),
                        // Animated.timing(
                        //     this.state.pan,
                        //     {
                        //         toValue: {x: Dimensions.get('window').height/2, y:-1000},
                        //         duration: 500
                        //     }
                        // )
                        Animated.timing(
                            this.state.scale,
                            {
                                toValue: 1,
                                duration: this.animation_speed
                            }
                        )
                    ]).start(()=>{  
                        this.setState({
                            focus: false
                        }, ()=>{
                            this.state.pan.setValue({x: 0, y: 0});
                            this.state.pan.flattenOffset();
                        })
                    })
                

                    const coordinates = {
                        x : e.nativeEvent.pageX,
                        y: e.nativeEvent.pageY
                    }
                    
                    Embassy.onFinishTraveling(coordinates)
                    this.gesture_started = false
                }
            }

          });
    }

    componentWillUnmount(){
        console.log("Draggable Unmounting");
        // Animated.timing(                  // Animate over time
        //     this.state.scale,            // The animated value to drive
        //     {
        //       toValue: 0,                   // Animate to opacity: 1 (opaque)
        //       duration: 1000,              // Make it take a while
        //     }
        //   ).start();  

        
    }

    render(){
        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let defaultSizeStyle =  {width: this.default_size.width, height: this.default_size.height}
        let translateStyle = {transform: [{translateX: this.state.pan.x}, {translateY: this.state.pan.y}]}
        let modalScaleStyle = {transform:[{scaleX: this.state.modal_scale}, {scaleY: this.state.modal_scale}]}

        let modalStyle = {transform: translateStyle.transform.concat(modalScaleStyle.transform)}
        let scaleStyle = {transform:[{scaleX: this.state.scale}, {scaleY: this.state.scale}]}
        return ( 
            <View {...this._panResponder.panHandlers} onLayout={this._onLayoutHandler}>
                <Modal
                    visible = {this.state.focus}
                    transparent = {true}>
                    <Animated.View style={[modalStyle, defaultSizeStyle]} >
                        {this.props.children}
                    </Animated.View>
                </Modal>

                
                <Animated.View style={[scaleStyle]}>
                    {this.props.children}
                </Animated.View>
            </View>)
    }
}


Draggable.propType = {
    source : PropTypes.any.isRequired,
    origin_list: PropTypes.any.isRequired,
    doubleTapHandler : PropTypes.func
}