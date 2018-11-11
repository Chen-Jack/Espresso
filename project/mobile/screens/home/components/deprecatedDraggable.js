import React from 'react'
import ReactNative, { View, Text, TouchableHighlight, PanResponder, Animated, FlatList} from 'react-native'

export default class Draggable extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            pan: new Animated.ValueXY(),
            spawn_animation: new Animated.Value(0) //Start initial scale as 0
        }
    }

    componentWillMount(){

        this._panResponder = PanResponder.create({
            onStartShouldSetResponder: (evt, gesture)=> true,
            onStartShouldSetResponderCapture: (evt, gestureState) => true,

            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
        
            onPanResponderGrant: (e, gestureState) => {
                console.log("Granted");
                // e.preventDefault()
                // e.stopPropagation()
                // this.props.stopScroll()
                //Set offset to x,y and set x,y to 0. (Make start position the origin)
                this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value})
                this.state.pan.setValue({x: 0, y: 0});
            },

            onPanResponderMove : ({nativeEvent}, gestureState) => {
                this.state.pan.setValue({x: gestureState.dx, y : gestureState.dy})
                // this.props.stopScroll()
                console.log("y", nativeEvent.pageY);
              
            },
        

            onPanResponderEnd: (e, gestureState) => {
                this.state.pan.flattenOffset();
                Animated.spring(
                    // Animate value over time
                    this.state.pan, // The value to drive
                    {
                      toValue: {x:0, y:0}, bounciness: 12, speed: 20 // Animate to final value of 1
                    }
                  ).start(); // Start the animation
                // this.props.startScroll()
            },

            onPanResponderRelease: (e, gestureState) => {
                console.log("E", e.nativeEvent.target);
                console.log("Target", ReactNative.findNodeHandle(e.nativeEvent.target));
                console.log("Total movement", gestureState.dx, gestureState.dy);
                // console.log("Event state", e.nativeEvent);
                // console.log("Release state", gestureState);
                this.state.pan.flattenOffset();
                Animated.spring(
                    // Animate value over time
                    this.state.pan, // The value to drive
                    {
                      toValue: {x:0, y:0}, bounciness: 12, speed: 20 // Animate to final value of 1
                    }
                  ).start(); // Start the animation
                // this.props.startScroll()
            }
            
          });
    }
    render(){
      
        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let imageStyle = {transform: this.state.pan.getTranslateTransform()};
        let scaleStyle = {transform:[{scaleX: this.state.spawn_animation}, {scaleY: this.state.spawn_animation}]}
        return (
            <Animated.View style={[scaleStyle, imageStyle]} {...this._panResponder.panHandlers}>
                <Text> Move please</Text>
                {this.props.children}
            </Animated.View> )
    }
}