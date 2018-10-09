import React from 'react'
import ReactNative, { View, Text, TouchableHighlight, PanResponder, Animated, FlatList} from 'react-native'
import {Button} from 'native-base'


class Draggable extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            pan: new Animated.ValueXY()
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
                if(nativeEvent.pageY < 300 ){
                    console.log("YES, called");
                    const arr = this.props.data;
                    const temp = arr[0]
                    arr[0] = arr[this.props.i]
                    arr[this.props.i] = temp;
                    this.props.updateData(arr)
                }
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
                this.props.startScroll()
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
                this.props.startScroll()
            }
            
          });
    }
    render(){
        let { pan } = this.state;
      
        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let imageStyle = {backgroundColor: "purple", transform: this.state.pan.getTranslateTransform()};
        return (
            <Animated.View style={[imageStyle, {margin: 10, padding: 10}]} {...this._panResponder.panHandlers}>
                <Text> Move please</Text>
                {this.props.children}
            </Animated.View> )
    }
}

export default class SandBox extends React.Component{
    constructor(props) {
        super(props)

        this.list = React.createRef()
        this.test = React.createRef()
        this.state = {
            canScroll : true,
            data: [{key: 'a'}, {key: 'b'},{key: 'c'}, {key: 'd'},{key: 'e'}, {key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'}, {key: 'j'},{key: 'k'}, {key: 'l'}]
        }
    }
    render(){
        return <View style={{padding: 10}}>
            <Button onPress={()=>{
                    this.test.current.measure((...x)=>{console.log("DIM", x)})
                }}>
                <Text>Check Dimensions</Text>
            </Button>
            <View ref ={this.test} >
                
                <FlatList
                    ref = {this.list}
                    scrollEnabled = {this.state.canScroll}
                    data={this.state.data}
                    renderItem={({item, index}) => <Draggable data={this.state.data} updateData={(new_data)=>{this.setState({data:new_data})}} i = {index} stopScroll={()=>{this.setState({canScroll: false})}} startScroll = {()=>{this.setState({canScroll : true})}}> <Text> {item.key}</Text></Draggable>}
                />

            </View>
          
        </View>
    }
}