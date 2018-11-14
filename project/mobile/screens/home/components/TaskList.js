import React from 'react'
import {Draggable, Landable} from './TravelingList'
import TaskCard from './TaskCard'
import {Dimensions} from 'react-native'

export default class TaskList extends React.Component{

    _renderListItem = ({item,index})=>{
        return (
            <Draggable>
                <TaskCard/>
            </Draggable>
        )  
    }

    render(){
        return <Landable
            data = {this.props.data}
            renderItem = {this._renderListItem}
            style={{height: 300, width: "100%"}}
        />
    }
}