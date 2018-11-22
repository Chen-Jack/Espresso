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

        this.state = {
            isFocus: false
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
            isFocus: true
        })
    }
    

    _onLeaveHandler = ()=>{
        console.log("unsetting");
        this.setState({
            isFocus: false
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
            cb(layout)
        })
    }

    render(){
        let focus_style = {backgroundColor: (this.state.isFocus ? "yellow" : null)}
        let landable_style = {height: "100%", width: "100%", ...focus_style}

        return <View
            ref={this.list}
            measureLayout = {this.measureLayout}>

            { this.props.data.length === 0 ? 
                <EmptyList/> :
                <Landable
                    index = {this.props.index}
                    onEnter = {this._onEnterHandler}
                    onLeave = {this._onLeaveHandler}
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