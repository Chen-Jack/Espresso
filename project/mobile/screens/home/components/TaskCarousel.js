import React from 'react'
import Carousel from 'react-native-snap-carousel'
import {View,Button, Text, Card, CardItem, Body} from 'native-base'
import {Dimensions} from 'react-native'
import TaskList from './TaskList'


export default class TaskCarousel extends React.Component{
    constructor(props) {
        super(props)
        
        this.carousel = React.createRef()
    }

    updateToDate = (date)=>{
        console.log("CALLED!!!")
        const index = this.props.task_data.findIndex((task)=>{
            console.log("TEST", task.date, "===?", date);
            return task.date === date ? true : false
        })

        console.log("INDEX IS", index);
        if(index)
            this.carousel.current.snapToItem(index)
    }

    _handleCardSelection = (data_index)=>{
        const iso_date = this.props.task_data[data_index].date;
        this.props.handleDateSelection(iso_date)
    }

    _renderTaskList = ({item: task, index})=>{
        mockdata = index === 0 ? [1,2,3,4,5] : [1,2,3]
        return <View>
            <Text> Date </Text>
            <TaskList data = {mockdata}/>
        </View>
    }

    render(){
    
        return (
            <View>
                <Carousel
                    ref = {this.carousel}
                    firstItem = {20}
                    onSnapToItem = {this._handleCardSelection}
                    layout={'default'} 
                    data={this.props.task_data}
                    renderItem={this._renderTaskList}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width}
                    useScrollView = {true}
                />
            </View>
        )
    }
}