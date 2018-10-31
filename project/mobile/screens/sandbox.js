import React from 'react'
import ReactNative, { Modal, View, Text, TouchableHighlight, PanResponder, Animated, FlatList} from 'react-native'
import {Button} from 'native-base'


class Draggable extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            pan: new Animated.ValueXY(),
            focus : false ,
        }

        this.default_size = {width:0, height:0}
    }

    _onLayoutHandler = (e)=>{
        console.log("layout", e.nativeEvent.layout);
        this.default_size = {
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height
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
                const center_offset = {
                    x: this.default_size.width/2,
                    y: this.default_size.height/2
                }
                this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value})
                this.state.pan.setValue({
                    x: gestureState.x0 - center_offset.x,
                    y: gestureState.y0 - center_offset.y
                });
            },

            onPanResponderMove : ({nativeEvent}, gestureState) => {
                const center_offset = {
                    x: this.default_size.width/2,
                    y: this.default_size.height/2
                }
                this.state.pan.setValue({
                    x: gestureState.moveX - center_offset.x, 
                    y: gestureState.moveY - center_offset.y
                })
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
                this.setState({
                    focus: false
                }, ()=>{
                
                    this.state.pan.setValue({x: 0, y: 0});
                    this.state.pan.flattenOffset();
                })
                // Animated.spring(
                //     this.state.pan, // The value to drive
                //     {
                //       toValue: {x:0, y:0}, bounciness: 12, speed: 20 // Animate to final value of 1
                //     }
                //   ).start(()=>{
                  
                //   }); // Start the animation
            }
          });
    }

    render(){
        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let imageStyle = {backgroundColor: "purple", transform: this.state.pan.getTranslateTransform()};
        return ( 
            <View {...this._panResponder.panHandlers}>
                {this.state.focus ? 
                <Modal
                    visible = {true}
                    transparent = {true}>
                    <Animated.View style={[imageStyle, {width: this.default_size.width, height: this.default_size.height}]} >
                    {/* <Animated.View style={[imageStyle]} {...this._panResponder.panHandlers}> */}
                        <Text> Move please</Text>
                        <Text> TEST </Text>
                    {/* </Animated.View>  */}
                    </Animated.View>
                </Modal>
                :
                <View style={{backgroundColor: "yellow"}} onLayout={this._onLayoutHandler}>
                {/* <Animated.View style={[imageStyle]} {...this._panResponder.panHandlers}> */}
                    <Text> Move please</Text>
                    {this.props.children}
                {/* </Animated.View> ) */}
                </View>}
            </View>)
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