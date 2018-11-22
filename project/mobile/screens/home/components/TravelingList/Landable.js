import Embassy from './Embassy'
import React from 'react'
import {Button} from 'native-base'
import {View, Text,FlatList} from 'react-native'
import PropTypes from 'prop-types'

export default class Landable extends React.Component{
    constructor(props){
        super(props)

        this.list = React.createRef()
        Embassy.registerLandable(this.list)

        this.state = {
            data : [],
            isHover: false,
            active: false,
            canScroll : true
        }

        this.layout = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
    }

    componentDidMount(){
        this.setState({
            data: this.props.data
        }) 
    }

    // componentDidUpdate(){
    //     this._updateLayout()
    // }

    addItem = ()=>{
        // const new_data = this.state.test_data
        // new_data.push(10)
            
        // this.setState({
        //     data: new_data
        // })
    }

    removeItem = ()=>{
        // const new_data = this.state.test_data
        // new_data.shift()
        // this.setState({
        //     data: new_data
        // })
    }

    _toggleScroll = (specifiedScrollStatus = null)=>{
        this.setState({
            canScroll: specifiedScrollStatus? specifiedScrollStatus: !this.state.canScroll
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
            console.log(`Landable Layout Updated for ${this.props.index}`, layout);
            this.layout = layout;
        })       
    }
        

    _onFocus = ()=>{
        console.log(this.props.name, "Gained Focus");
        this.setState({
            active: true,
            isFocus: true
        }, this.props.onEnter())
    }
    _onLoseFocus = ()=>{
        console.log(this.props.name, "Lost Focus");
        this.setState({
            active: false,
            isFocus: false
        }, this.props.onLeave())
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

       const x0 = this.layout.x
       const y0 = this.layout.y
       const x1 = this.layout.x + this.layout.width 
       const y1 = this.layout.y + this.layout.height

       const isWithinX = (x0 < location.x ) && (location.x < x1)
       const isWithinY = (y0 < location.y) && (location.y < y1)

        if( isWithinX && isWithinY ){
            return true
        }
        else{
            return false
        }
    }


    render(){
        return (

            <View 
                onLayout={this._updateLayout}
                updateLayout = {this._updateLayout}
                ref = {this.list}
                isGestureOnTop = {this._isGestureOnTop}
                toggleScroll = {this._toggleScroll}

                onFocus = {this._onFocus}
                onLoseFocus = {this._onLoseFocus}
                onStay = {this._onStay}
                onHandleRelease = {this._onHandleRelease}

                addItem = {this.addItem}
                removeItem = {this.removeItem}
                
                style={this.props.style || {height:"100%", width: "100%"}}>

                {/* <Button onPress={()=>{
                    this.list.current.measure((x,y,width,height,pageX,pageY)=>{
                        const layout = {
                            x: pageX,
                            y: pageY,
                            width: width,
                            height: height
                        }
                        console.log("x, y is", layout.x, layout.y);
                        console.log("wid, height is", layout.width, layout.height);
                    })
                    this._updateLayout()
                }}>
                    <Text>Check Dimensions</Text>
                </Button> */}

                

                <FlatList
                    scrollEnabled = {this.state.canScroll}
                    style={{height: "100%", width: "100%"}}
                    data = {this.props.data || this.state.test_data}
                    renderItem = {this.props.renderItem}/>

            </View>
        )
    }
}

Landable.propTypes = {
    renderItem: PropTypes.func.isRequired,
    onEnter : PropTypes.func,
    onLeave : PropTypes.func
}