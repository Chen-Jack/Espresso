import React from 'react'
import PropTypes from 'prop-types'
import Carousel from 'react-native-snap-carousel'
import {View, Text, Button} from 'native-base'
import {Dimensions} from 'react-native'
import TaskList from './TaskList'
import {Embassy} from '../TravelingList'


export default class TaskCarousel extends React.Component{
    constructor(props) {
        super(props)
        
        this.state={
            canScroll : true,
            thresh: 30
        }
        this.carousel = React.createRef()
    }

    componentDidMount(){
        Embassy.addOnStartHandler(this.disableCarouselScroll)
        Embassy.addOnReleaseHandler(this.enableCarouselScroll)
    }

    disableCarouselScroll = (coordinates, cb=()=>{})=>{
        this.setState({
            canScroll: false
        },()=>{
            cb()
        })
    }
    
    enableCarouselScroll = (coordinates, cb=()=>{})=>{
        this.setState({
            canScroll: true
        }, ()=>{
            cb()
        })
    }

    updateToDate = (date)=>{
        const index = this.props.task_data.findIndex((task)=>{
            return task.date === date ? true : false
        })
        if(index)
            this.carousel.current.snapToItem(index)
    }

    _handleCardSelection = (data_index)=>{
        const iso_date = this.props.task_data[data_index].date;
        this.props.handleDateSelection(iso_date)
    }

    _renderTaskList = ({item: tasks_of_the_day, index})=>{
        return <View >
            <Text style={{fontSize: 16, backgroundColor:"white", padding: 10}}> {"Date: " + tasks_of_the_day.date || "Date"} </Text>
            <TaskList data = {tasks_of_the_day.tasks}/>
        </View>
    }

    render(){

        return (
            <View style={{marginTop: 20, height:300}}>
                <Carousel
                    showsHorizontalScrollIndicator = {true}
                    swipeThreshold = {20}
                    scrollEnabled = {this.state.canScroll}
                    ref = {this.carousel}
                    onSnapToItem = {this._handleCardSelection}
                    data={this.props.task_data}
                    renderItem={this._renderTaskList}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width}
                />
            </View>
        )
    }
}

TaskCarousel.propTypes = {
    task_data : PropTypes.array.isRequired,
    handleDateSelection : PropTypes.func
}