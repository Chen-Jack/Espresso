import Embassy from './Embassy'
import React from 'react'
import {Button} from 'native-base'
import {View, Text,FlatList} from 'react-native'
import PropTypes from 'prop-types'

export default class Landable extends React.Component{
    constructor(props){
        super(props)

        this.list = React.createRef()

        this.state = {
            data : [],
            isHover: false,
            active: false,
            // canScroll : true
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

    _updateLayout = ()=>{
        this.list.current.measure((x,y,width,height,pageX,pageY)=>{
            const layout = {
                x: pageX,
                y: pageY,
                width: width,
                height: height
            }
            this.layout = layout;
        })       
    }
        

    // _onGestureFocus = ()=>{
    //     console.log(this.props.name, "Gained Focus");
    //     this.setState({
    //         active: true,
    //         isFocus: true
    //     }, this.props.onEnter())
    // }
    
    // _onGestureLoseFocus = ()=>{
    //     console.log(this.props.name, "Lost Focus");
    //     this.setState({
    //         active: false,
    //         isFocus: false
    //     }, this.props.onLeave())
    // }


    // _onHandleRelease = ()=>{
    //     /*
    //     Event handler for handling the event of a landable handling a gesture release
    //     */
    //     console.log(this.props.name, "Handling release");
    // }


    // _isGestureOnTop = (location)=>{
    //     /*
    //     Checks if the given coordinates are ontop of the landable
    //     */
    //    if(!location.x || !location.y){
    //        console.log("You forgot params");
    //        return false
    //    }

    //    const x0 = this.layout.x
    //    const y0 = this.layout.y
    //    const x1 = this.layout.x + this.layout.width 
    //    const y1 = this.layout.y + this.layout.height

    //    const isWithinX = (x0 < location.x ) && (location.x < x1)
    //    const isWithinY = (y0 < location.y) && (location.y < y1)

    //     if( isWithinX && isWithinY ){
    //         return true
    //     }
    //     else{
    //         return false
    //     }
    // }


    render(){
        return (

            <View 
                
                style={this.props.style || {height:"100%", width: "100%"}}>

                

                <FlatList
                    scrollEnabled = {this.props.canScroll}
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
    onLeave : PropTypes.func,
    canScroll: PropTypes.bool
}