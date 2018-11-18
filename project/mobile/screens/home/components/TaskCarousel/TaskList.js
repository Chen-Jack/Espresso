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
    _renderListItem = ({item,index})=>{
        return (
            <TaskCard task_id={item.id} title={item.title} details={item.details} isCompleted={item.completed}/>
        )  
    }

    render(){
        if(this.props.data.length === 0)
            return <EmptyList/>
        else {
            return <Landable
                data = {this.props.data}
                renderItem = {this._renderListItem}
                style={{height: "100%", width: "100%"}}/>
        }
    }
}

TaskList.propTypes = {
    data: PropTypes.array.isRequired
}