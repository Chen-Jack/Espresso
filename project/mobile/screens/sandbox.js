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
                console.log("Clicked on", gestureState.x0, gestureState.y0);
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

                if(this.props.onMove){
                    this.props.onMove({
                        x: nativeEvent.pageX,
                        y: nativeEvent.pageY
                    })
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
        const opacityStyle = this.state.focus ? {opacity: 0} : null
        
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
                : null}

                
                <View style={[opacityStyle, {backgroundColor: "yellow"}]} onLayout={this._onLayoutHandler}>
                {/* <Animated.View style={[imageStyle]} {...this._panResponder.panHandlers}> */}
                    <Text> Move please</Text>
                    {this.props.children}
                {/* </Animated.View> ) */}
                </View>
            </View>)
    }
}

class Landable extends React.Component{
    constructor(props){
        super(props)

        this.list = React.createRef()
        this.state = {
            layout : {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
    }

    _onLayoutHandler = ({nativeEvent})=>{
        //Note that .measure doesn't seem to work on flatlist directly.
        //So we measure the containing view instead
        this.list.current.measure((x,y,width,height,pageX,pageY)=>{
            const layout = {
                x: pageX,
                y: pageY,
                width: width,
                height: height
            }

            this.setState({
                layout : layout
            })
        })
     

    }

    _isOnTop = (location)=>{
        /*
        Checks if the given coordinates are ontop of the landable
        */
       if(!location.x || !location.y){
           console.log("You forgot params");
           return false
       }

       const x0 = this.state.layout.x
       const y0 = this.state.layout.y
       const x1 = this.state.layout.x + this.state.layout.width 
       const y1 = this.state.layout.y + this.state.layout.height

       const isWithinX = (x0 < location.x ) && (location.x < x1)
       const isWithinY = (y0 < location.y) && (location.y < y1)

    
       
       if( isWithinX && isWithinY ){
           console.log("yep");
           return true
       }
       else{
           console.log("Nope");
           return false
       }
    }

    _onTop = ()=>{
        /*
        Event handler called when a gesture is above the landable
        */
       console.log("onTop Event");
    }

  

    render(){
        return (
                <View 
                    ref = {this.list} style={{width: "40%"}}>

                    <FlatList
                    onLayout = {this._onLayoutHandler}
                    scrollEnabled = {false}
                    style={{  backgroundColor: "#aaa"}}
                    data = {[1,2,3,4,5]}
                    renderItem = {({item,index})=>{
                        return (
                            <Draggable
                                onMove = {this._isOnTop}>
                                <Text>
                                    {item}
                                </Text>
                            </Draggable>
                        )  
                    }}
                    />

                </View>
        )
    }
}

export default class SandBox extends React.Component{
    constructor(props) {
        super(props)
    }
    render(){
        return <View style={{flexDirection: "row"}}>
            <Landable/>
            <Landable/>
        </View>
    }
}