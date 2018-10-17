import React from 'react'
import {FlatList, Text, Dimensions, View} from 'react-native'
import TravelingCard from './TravelingCard'
import Draggable from './Draggable'


export default class TravelabeList extends React.Component{
    constructor(props) {
        super(props)

        this.state= {
            allowScroll: false
        }
    }

    _disableScroll = ()=>{
        this.setState({
            allowScroll : false
        })
    }

    _startScroll = ()=>{
        this.setState({
            allowScroll: true
        })
    }

    
    render(){
        const TravelingComponent = this.props.travelingComponent //Ideally TravelingCard
        return <FlatList
            scrollEnabled = {this.state.allowScroll}
            style = {{padding:10, margin: 0, backgroundColor:"green", overflow:'visible'}}
            data = {this.props.data}
            renderItem = {({item: task, index})=>{
                // return <TravelingComponent 
                //     key = {index}
                //     title={task.title} 
                //     created_at={task.created_at} 
                //     details={task.details}
                    
                //     onStartMove = {this._disableScroll}
                //     onStopMove = {this._startScroll}
                //     />
                return <Draggable/>

                
            }}/>
    }
}

