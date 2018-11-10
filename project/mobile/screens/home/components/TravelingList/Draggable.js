import Embassy from './Embassy'
import React from 'react'
import ReactNative, { Modal, View, Text, TouchableHighlight, PanResponder, Animated, FlatList} from 'react-native'
import {Button} from 'native-base'

export default class Draggable extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            pan: new Animated.ValueXY(),
            focus : false ,
            scale: new Animated.Value(0), //Start initial scale as 0,
            modal_scale: new Animated.Value(1)
        }
        
        this.animation_speed = 300;
        this.ms_to_trigger_long_press = 500; 
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

    componentWillMount(){
        Animated.timing(                  // Animate over time
            this.state.scale,            // The animated value to drive
            {
              toValue: 1,                   // Animate to opacity: 1 (opaque)
              duration: 500,              // Make it take a while
            }
          ).start();  

        this._panResponder = PanResponder.create({
            onStartShouldSetResponder: (evt, gesture) => true,
            onStartShouldSetPanResponder : (evt, gesture) => true,
            // onStartShouldSetResponderCapture: (evt, gestureState) => true,

            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            // onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponder: (evt,gestureState) => true,

            // onMoveShouldSetPanResponderCapture: () => true,
        
            onPanResponderGrant: (e, gestureState) => {
                e.persist() //Must persist event to access async

                const long_press_callback = (e, gestureState)=>{
            
                    this.gesture_started = true

                    this.setState({
                        focus: true
                    }, ()=>{
                        Animated.parallel([
                            Animated.timing(                  // Animate over time
                                this.state.modal_scale,            // The animated value to drive
                                {
                                    toValue: 1.25,                   // Animate to opacity: 1 (opaque)
                                    duration: this.animation_speed,              // Make it take a while
                                }
                            ),
                            Animated.timing(
                                this.state.scale,
                                {
                                    toValue: 0,
                                    duration: this.animation_speed
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
                    Embassy.onStartHandler(coordinates)
                    
                }

                this.timer_ref = setTimeout( 
                    long_press_callback.bind(this, e, gestureState), 
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
                    Embassy.onMoveHandler(coordinates)
                    
 
                }
            },
        

            // onPanResponderEnd: (e, gestureState) => {
            //     this.setState({
            //         focus: false
            //     })

            //      this.state.pan.setValue({x: 0, y: 0});
            //     this.state.pan.flattenOffset();
            //     Animated.spring(
            //         this.state.pan, // The value to drive
            //         {
            //           toValue: {x:0, y:0}, bounciness: 12, speed: 20 // Animate to final value of 1
            //         }
            //       ).start(); // Start the animation
            // },

            onResponderTerminationRequest: (e,gesturestate) => false,

            onPanResponderRelease: (e, gestureState) => {
                if(!this.gesture_started){
                    //Released too early before actuall starting gesture
                    clearTimeout(this.timer_ref)
                    this.timer_ref = null
                }
                else{
                    Animated.parallel([
                        Animated.timing(                  // Animate over time
                            this.state.modal_scale,            // The animated value to drive
                            {
                                toValue: 0,                   // Animate to opacity: 1 (opaque)
                                duration: this.animation_speed,              // Make it take a while
                            }
                        ),
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
                    Embassy.onReleaseHandler(coordinates)
                    
                }
            }
          });
    }

    componentWillUnmount(){
        Animated.timing(                  // Animate over time
            this.state.scale,            // The animated value to drive
            {
              toValue: 0,                   // Animate to opacity: 1 (opaque)
              duration: 1000,              // Make it take a while
            }
          ).start();  

        
    }

    render(){
        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let defaultSizeStyle =  {width: this.default_size.width, height: this.default_size.height}
        // let translateStyle = {transform: this.state.pan.getTranslateTransform()}

        let translateStyle = {transform: [{translateX: this.state.pan.x}, {translateY: this.state.pan.y}]}
        let modalScaleStyle = {transform:[{scaleX: this.state.modal_scale}, {scaleY: this.state.modal_scale}]}
        let modalStyle = {transform: translateStyle.transform.concat(modalScaleStyle.transform)}

        let imageStyle = {backgroundColor: "purple"};
        let scaleStyle = {transform:[{scaleX: this.state.scale}, {scaleY: this.state.scale}]}
        return ( 
            <View {...this._panResponder.panHandlers} onLayout={this._onLayoutHandler}>
                <Modal
                    visible = {this.state.focus}
                    transparent = {true}>
                    <Animated.View style={[modalStyle, imageStyle, defaultSizeStyle]} >
                        <Text> Move please</Text>
                        <Text> TEST </Text>
                    </Animated.View>
                </Modal>

                
                <Animated.View style={[scaleStyle, {borderStyle: "solid", borderColor: "black", borderWidth: 1, backgroundColor: "yellow"}]}>\
                    <Text> Move please</Text>
                    {this.props.children}
                </Animated.View>
            </View>)
    }
}
