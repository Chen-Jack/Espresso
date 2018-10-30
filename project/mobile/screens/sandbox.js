import React from 'react'
import ReactNative, { Modal, View, Text, TouchableHighlight, PanResponder, Animated, FlatList} from 'react-native'
import {Button} from 'native-base'


class Draggable extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            pan: new Animated.ValueXY(),
            focus : false 
        }
    }

    componentWillMount(){
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
                this.setState({
                    focus: true
                })
                console.log("gesture", gestureState);
                this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value})
                this.state.pan.setValue({x: gestureState.x0-20 , y: gestureState.y0-20});
            },

            onPanResponderMove : ({nativeEvent}, gestureState) => {
                this.state.pan.setValue({x: gestureState.moveX, y : gestureState.moveY})
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
                
                this.state.pan.setValue({x: 0, y: 0});
                this.state.pan.flattenOffset();
                Animated.spring(
                    this.state.pan, // The value to drive
                    {
                      toValue: {x:0, y:0}, bounciness: 12, speed: 20 // Animate to final value of 1
                    }
                  ).start(()=>{
                    this.setState({
                        focus: false
                    })
                  }); // Start the animation
            }
          });
    }
    render(){
      
        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let imageStyle = {backgroundColor: "purple", transform: this.state.pan.getTranslateTransform()};
        return ( 
            <Animated.View style={[imageStyle]} {...this._panResponder.panHandlers}>
                {this.state.focus ? 
                <Modal
                    visible = {true}
                    transparent = {true}>
                    <Animated.View style={imageStyle} >
                    {/* <Animated.View style={[imageStyle]} {...this._panResponder.panHandlers}> */}
                        <Text> Move please</Text>
                        <Text> TEST </Text>
                    {/* </Animated.View>  */}
                    </Animated.View>
                </Modal>
                :
                <View>
                {/* <Animated.View style={[imageStyle]} {...this._panResponder.panHandlers}> */}
                    <Text> Move please</Text>
                    {this.props.children}
                {/* </Animated.View> ) */}
                </View>}
            </Animated.View>)
    }
}

export default class SandBox extends React.Component{
    constructor(props) {
        super(props)
    }
    render(){
        return <View>
            <FlatList
                scrollEnabled = {false}
                style={{width: "70%"}}
                data={[1,2,3]}
                renderItem = {({item, index})=>{ return <Draggable> <Text>{item}</Text></Draggable>}}
            />
        </View>
    }
}