import React from 'react'
import ReactNative, { Modal, View, Text, TouchableHighlight, PanResponder, Animated, FlatList} from 'react-native'
import {Button} from 'native-base'

class Embassy{
    /*
    A class to act as a middleman between all the landables. Not intended to be 
    instantiated. Every instantiated landable should let the Embassy know.
    */
    static registeredLandables = []

    static registerLandable = (ref)=>{
        Embassy.registeredLandables.push(ref)
    }

    static unregisterLandable = (ref)=>{
        /*
        This function takes a react reference
        Returns true on successful deletion. False when item is not in the array
        */
        for(let i in Embassy.registeredLandables){
            if(Embassy.registeredLandables[i] === ref){
                Embassy.registeredLandables.splice(i, 1)
                return true
            }
        }
        
        return false
    }

    static isOnTopAnyLandable = (coordinates)=>{
        /*
        Given screen coordinates, checks if the coordinates are on top of any of the
        registered landables. Returns the reference when true, returns null otherwise
        */
       for(let landable of Embassy.registeredLandables){
           if(landable.current.props.isOnTop(coordinates)){
               return landable
           }
       }

       return null
    }

    static onMoveHandler = (coordinates)=>{
        // const coordinates = {
        //     x: nativeEvent.pageX,
        //     y: nativeEvent.pageY
        // }

        Embassy.checkAndExecuteActions(coordinates)
    }

    static checkAndExecuteActions = (coordinates)=>{
        /*
        Checks if the coordinates are on top of any landable. If yes,
        execute it's onTop() event handler
        */

        const landable = Embassy.isOnTopAnyLandable(coordinates)
        if(landable){
            landable.current.props.onTop()
        }
        else{
            console.log("Not ontop of any landables")
        }
    }
}

class Draggable extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            pan: new Animated.ValueXY(),
            focus : false ,
            spawn_animation: new Animated.Value(0) //Start initial scale as 0
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
        Animated.timing(                  // Animate over time
            this.state.spawn_animation,            // The animated value to drive
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

    componentWillUnmount(){
        Animated.timing(                  // Animate over time
            this.state.spawn_animation,            // The animated value to drive
            {
              toValue: 0,                   // Animate to opacity: 1 (opaque)
              duration: 500,              // Make it take a while
            }
          ).start();  
    }

    render(){
        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        let imageStyle = {backgroundColor: "purple", transform: this.state.pan.getTranslateTransform()};
        const opacityStyle = this.state.focus ? {opacity: 0} : null
        let scaleStyle = {transform:[{scaleX: this.state.spawn_animation}, {scaleY: this.state.spawn_animation}]}
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

                
                <Animated.View style={[scaleStyle, opacityStyle, {backgroundColor: "yellow"}]} onLayout={this._onLayoutHandler}>
                {/* <Animated.View style={[imageStyle]} {...this._panResponder.panHandlers}> */}
                    <Text> Move please</Text>
                    {this.props.children}
                {/* </Animated.View> ) */}
                </Animated.View>
            </View>)
    }
}

class Landable extends React.Component{
    constructor(props){
        super(props)

        this.list = React.createRef()
        Embassy.registerLandable(this.list)
        this.state = {
            data : [],
            layout : {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            test_data : [1,2,3,4,5]
        }
    }


    addItem = ()=>{
        const new_data = this.state.test_data
        new_data.push(10)
            
        this.setState({
            data: new_data
        })
    }

    removeItem = ()=>{
        const new_data = this.state.test_data
        new_data.shift()
        this.setState({
            data: new_data
        })
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
        //    console.log("yep");
           return true
       }
       else{
        //    console.log("Nope");
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
                ref = {this.list} style={{width: "40%"}}
                onTop = {this._onTop}
                isOnTop = {this._isOnTop}>

                <FlatList
                onLayout = {this._onLayoutHandler}
                scrollEnabled = {false}
                style={{  backgroundColor: "#aaa"}}
                data = {this.state.test_data}
                renderItem = {({item,index})=>{
                    return (
                        <Draggable
                            onMove = {Embassy.onMoveHandler}>
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

        this.test = React.createRef()
    }
    render(){
        return <View>
            <Button onPress={()=>{
                console.log(Embassy.registeredLandables.length)
                console.log(Embassy.registeredLandables)
                }}>
                <Text>
                    Check Embassy
                </Text>
            </Button>
            <Button onPress={()=>{this.test.current.addItem()}}>
                <Text>
                    Add Item
                </Text>
            </Button>
            <Button onPress={()=>{this.test.current.removeItem()}}>
                <Text>
                    Remove Item
                </Text>
            </Button>
            <Landable ref={this.test}/>
            <View>
                <Text> Idk </Text>
                <Landable/>
            </View>
            
        </View>
    }
}