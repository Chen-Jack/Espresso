import React from 'react'
import {TouchableHighlight, Animated, PanResponder} from 'react-native'
import {Badge, Item, Card, CardItem,Text, View} from 'native-base'
import Modal from 'react-native-modal'


export default class TravelingCard extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            pan: new Animated.ValueXY(),
            isFocus: false,    //Used for zIndexing purposes. When true, we make the card on top
            timeout: null,
        }
        
    }

    _onStartMove = this.props.onStartMove ? this.props.onStartMove :  ()=>{}
    _onMove = this.props.onMove ? this.props.onMove : ()=>{}
    _onStopMove = this.props.onStopMove ? this.props.onStopMove : ()=>{}

    startLongPressTimer = (cb)=>{
        this.setState({
            timeout: setTimeout(()=>{cb()}, 1)
        })
    }

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onPanResponderTerminationRequest: () => false,
 
            // onStartShouldSetResponderCapture: (evt, gestureState) => true,
            onStartShouldSetResponder: (evt, gesture) => {console.log("A"); return true},
            onStartShouldSetPanResponder: (evt, gestureState) => {console.log("B");return true},
            onMoveShouldSetResponder: ()=> {console.log("C") ; return true},
            onMoveShouldSetPanResponder: ()=>{console.log("D"); return true},
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

            // onMoveShouldSetResponderCapture: () => true,
            // onMoveShouldSetPanResponderCapture: () => true,
        
            onPanResponderGrant: (e, gestureState) => {
                // this.setState({
                //     isFocus : true
                // })
                
                // e.preventDefault()
                // e.stopPropagation()
              
                //Set offset to x,y and set x,y to 0. (Make start position the origin)
                console.log("started");
                this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value})
                this.state.pan.setValue({x: 0, y: 0});
            },

            onPanResponderMove : (e, gestureState) => {
                this.state.pan.setValue({x: gestureState.dx, y : gestureState.dy})
            },
        

            onPanResponderEnd: (e, gestureState) => {
                this.setState({
                    isFocus : false
                })
                this.state.pan.flattenOffset();
                Animated.spring(
                    // Animate value over time
                    this.state.pan, // The value to drive
                    {
                      toValue: {x:0, y:0}, bounciness: 12, speed: 20 // Animate to final value of 1
                    }
                  ).start(); // Start the animation
            },

            onPanResponderRelease: (e, gestureState) => {
                clearTimeout(this.state.timeout)
                this.setState({
                    isFocus : false
                })
                this.state.pan.flattenOffset();
                Animated.spring(
                    // Animate value over time
                    this.state.pan, // The value to drive
                    {
                      toValue: {x:0, y:0}, bounciness: 12, speed: 20 // Animate to final value of 1
                    }
                  ).start(); // Start the animation
            } 
        });
    }

    render(){
        let imageStyle = {transform: this.state.pan.getTranslateTransform(), backgroundColor:"purple"};
        // let focusStyle = {position : this.state.isFocus ? "fixed" : "relative", backgroundColor:"red"}


        return <Animated.View style={[imageStyle]} {...this._panResponder.panHandlers}>
            <Card >
                <CardItem header bordered>
                    <Text> {this.props.title} </Text>
                </CardItem>
            </Card>
        </Animated.View>
    }
}