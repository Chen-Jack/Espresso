import React from 'react'
import {View, Text, Button} from 'react-native'
import {Landable} from './../TravelingList'
import TaskCard from './TaskCard'
import PropTypes from 'prop-types'


const EmptyList = (props)=>{
    return <View style={{width:"100%", height:"50%", backgroundColor: "white", alignSelf:"center", justifyContent:"center"}}>
        <Text>
            You have nothing to do.
        </Text>
    </View>
}

export default class TaskList extends React.Component{
    constructor(props) {
        super(props)

        this.list = React.createRef()
        this.layout = null

        this.state = {
            isGestureHovering: false,
            canScroll : true
        }
    }
    _renderListItem = ({item,index})=>{
        return (
            <TaskCard task_id={item.id} title={item.title} date={item.allocated_date} details={item.details} isCompleted={item.completed}/>
        )  
    }

    _onEnterHandler = ()=>{
        console.log("setting");
        this.setState({
            isGestureHovering: true
        })
    }

    _onLeaveHandler = ()=>{
        console.log("unsetting");
        this.setState({
            isGestureHovering: false
        })
    }

    measureLayout = (cb=()=>{})=>{
        this.list.current.measure((x,y,width,height,pageX,pageY)=>{
            const layout = {
                x: pageX,
                y: pageY,
                width: width,
                height: height
            }
            this.layout = layout
            cb(layout)
        })
    }

    // updateLayout = ()=>{
    //     this.list.current.measure((x,y,width,height,pageX,pageY)=>{
    //         const layout = {
    //             x: pageX,
    //             y: pageY,
    //             width: width,
    //             height: height
    //         }
    //         this.layout = layout
    //     })
    // }


    isGestureOnTop = (location)=>{
        /*
        Checks if the given coordinates are ontop of the landable
        */

        this.measureLayout((layout)=>{
            if(!location.x || !location.y){
                console.log("You forgot params");
                return false
            }

            const x0 = layout.x
            const y0 = layout.y
            const x1 = layout.x + layout.width 
            const y1 = layout.y + layout.height

            const isWithinX = (x0 < location.x ) && (location.x < x1)
            const isWithinY = (y0 < location.y) && (location.y < y1)

            if( isWithinX && isWithinY ){
                return true
            }
            else{
                return false
            }
        })
    }

    toggleScroll = (status = null)=>{
        this.setState({
            canScroll : status || !this.state.canScroll
        })
    }

    onGestureFocus = ()=>{
        console.log("Gesture start");
        this._onEnterHandler()
    }

    onGestureLoseFocus = ()=>{
        this._onLeaveHandler()
        console.log("Gesture leave");
    }

    // onFocusedList = ()=>{
    //     this.updateLayout()
    //     console.log("Now the focused List");
    // }

    // onLostFocusedList = ()=>{
    //     // this.updateLayout()
    //     console.log("No longer the focused list");
    // }

    onGestureStay = ()=>{
        console.log("Gesture Stay");
    }

    onHandleReleasedGesture = ()=>{
        console.log("Captured the released gesture");
    }

    // onLayoutHandler = ()=>{
    //     this.measureLayout((layout)=>{
            
    //     })
    // }

    render(){
        let focus_style = {backgroundColor: (this.state.isGestureHovering ? "yellow" : null)}
        let landable_style = {height: "100%", width: "100%", ...focus_style}
        return <View
            // onLayout={this.onLayoutHandler}
            ref={this.list}
            // isGestureOnTop = {this.isGestureOnTop}
            // onFocusedList = {this._onFocusedList}
            // onLostFocusedList = {this.onLostFocusedList}
            // measureLayout = {this.measureLayout}
            >

            { this.props.data.length === 0 ? 
                <EmptyList/> :
                <Landable
                    canScroll = {this.state.canScroll}
                    index = {this.props.index}
                    // onEnter = {this._onEnterHandler}
                    // onLeave = {this._onLeaveHandler}
                    data = {this.props.data}
                    renderItem = {this._renderListItem}
                    style={landable_style}/>          
            }

        </View>
    }
}

TaskList.propTypes = {
    data: PropTypes.array.isRequired
}