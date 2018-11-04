import React from 'react'
import ReactNative, { Modal, View, Text, TouchableHighlight, PanResponder, Animated, FlatList} from 'react-native'
import {Button} from 'native-base'

class Embassy{
    /*
    I love shelly <3 doki doki :3 xD xP :T :p :P x3 83 ^__^ >__> >__< >x< owo o3o o-o O_O o.o o-O O-O Q_Q T-T T_T *_* ^-^ x_x @_@ 
    -_- n_n .___. (> ^^ )> .-. ~_~ 8D 8-D >:D :^) ^o^ u_u :) :o 8===D 
    A class to act as a middleman between all the landables. Not intended to be 
    instantiated. Every instantiated landable should let the Embassy know.
    */
    static registeredLandables = []
    static origin_target = null //React reference to the source of the original Landable
    static active_target = null; //React reference to the active Landable

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

    static findTarget = (coordinates) => {
        for( let landable of Embassy.registeredLandables){
            if(landable.current.props.isGestureOnTop(coordinates)){
                return landable
            }
        }
        return null
    }

    static updateTarget = (new_target) => {
        /*
        Updates the active target. The prev target then should lose focus, while
        the new target gains focus
        */
        const prev_target = Embassy.active_target
        if((prev_target === null) && (new_target === null)){
            //If nothing happened. No prev target, no new target
            return null
        }

        if(prev_target === new_target){
            // Target is still the same landable
            Embassy.active_target.current.props.onStay()
        }
        else{
            // There is a target switch
            if(prev_target){
                prev_target.current.props.onLoseFocus()
            }
            if(new_target){
                new_target.current.props.onFocus()
            }
        }

        Embassy.active_target = new_target
        return Embassy.active_target
    }

    static findAndUpdateTarget = (coordinates) => {
        const new_target = Embassy.findTarget(coordinates)
        Embassy.updateTarget(new_target)
    }

    static onStartHandler = (coordinates)=>{
        /*
        The starting handler and active handler are always the same.
        Cause you havent moved away from the origin yet
        */
        const target = Embassy.findTarget(coordinates)
        Embassy.origin_target = target
        Embassy.updateTarget(target)
    }

    static onMoveHandler = (coordinates)=>{
        /*
        const landable_target = findTarget(coordinates)
        */
        // Embassy.checkAndExecuteActions(coordinates)

        const target = Embassy.findAndUpdateTarget(coordinates)
    }

    static onReleaseHandler = (coordinates)=>{
 
        const capturing_landable = Embassy.findTarget(coordinates)
        if(capturing_landable){
            capturing_landable.current.props.onHandleRelease()
        }

        if(Embassy.active_target){
            Embassy.active_target.current.props.onLoseFocus()
            Embassy.active_target = null
        }
        
        Embassy.origin_target = null
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

             
                if(this.props.onStart){
                    const coordinates = {
                        x : e.nativeEvent.pageX,
                        y: e.nativeEvent.pageY
                    }
                    this.props.onStart(coordinates)
                }
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
                    const coordinates = {
                        x : nativeEvent.pageX,
                        y: nativeEvent.pageY
                    }
                    this.props.onMove(coordinates)
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

                if(this.props.onRelease){
                    const coordinates = {
                        x : e.nativeEvent.pageX,
                        y: e.nativeEvent.pageY
                    }
                    this.props.onRelease(coordinates)
                }
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
            test_data : [1,2,3,4,5],
            active: false
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

    _updateLayout = ()=>{
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

   

    _onFocus = ()=>{
        console.log(this.props.name, "Gained Focus");
        this.setState({
            active: true
        })
    }
    _onLoseFocus = ()=>{
        console.log(this.props.name, "Lost Focus");
        this.setState({
            active: false
        })
    }

    _onStay = ()=>{
        console.log(this.props.name, "Stayed");
    }

    _onHandleRelease = ()=>{
        /*
        Event handler for handling the event of a landable handling a gesture release
        */
        console.log(this.props.name, "Handling release");
    }


    _isGestureOnTop = (location)=>{
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
           return true
       }
       else{
           return false
       }
    }


    
    _renderListItem = ({item,index})=>{
        return (
            <Draggable
                onStart = {Embassy.onStartHandler}
                onMove = {Embassy.onMoveHandler}
                onRelease = {Embassy.onReleaseHandler}>
                <Text>
                    {item}
                </Text>
            </Draggable>
        )  
    }

    render(){
        return (
            <View 
                ref = {this.list} 
                style = {{width: "40%"}}
                isGestureOnTop = {this._isGestureOnTop}

                onFocus = {this._onFocus}
                onLoseFocus = {this._onLoseFocus}
                onStay = {this._onStay}
                onHandleRelease = {this._onHandleRelease}>

                <FlatList
                    onLayout = {this._updateLayout}
                    scrollEnabled = {false}
                    style={{ backgroundColor: "#aaa"}}
                    data = {this.state.test_data}
                    renderItem = {this._renderListItem}/>

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
            
            <Landable name="List A" ref={this.test}/>
            <View>
                <Text> Idk </Text>
                <Landable name="List B"/>
            </View>
            
        </View>
    }
}