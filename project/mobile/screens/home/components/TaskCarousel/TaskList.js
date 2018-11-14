import React from 'react'
import {View, Text} from 'react-native'
import {Draggable, Landable} from './../TravelingList'
import TaskCard from './TaskCard'

const EmptyList = (props)=>{
    return <View style={{width:"100%", height:"95%", backgroundColor: "white", alignSelf:"center", justifyContent:"center"}}>
        <Text>
            You have nothing to do.
        </Text>
    </View>
}

export default class TaskList extends React.Component{
    _renderListItem = ({item,index})=>{
        return (
            <Draggable>
                <TaskCard title={item.title} details={item.details} isCompleted={item.completed}/>
            </Draggable>
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