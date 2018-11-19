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

    render(){
        let focus_style = {backgroundColor: (this.state.isFocus ? "yellow" : null)}
        let landable_style = {height: "100%", width: "100%", ...focus_style}
        if(this.props.data.length === 0)
            return <EmptyList/>
        else {
            return <Landable
                onEnter = {this._onEnterHandler}
                onLeave = {this._onLeaveHandler}
                data = {this.props.data}
                renderItem = {this._renderListItem}
                style={landable_style}/>
        }
    }
}

TaskList.propTypes = {
    data: PropTypes.array.isRequired
}