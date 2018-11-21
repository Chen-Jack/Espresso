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
        }
        this.carousel = React.createRef()
        this.wrapper = React.createRef()

        this.layout = null;
    }

    _onGestureStart = (coordinates)=>{
        
    }
    _onGestureMove = (coordinates)=>{
       this.isOnScrollableEdge(coordinates)
    }

    _onGestureRelease = (coordinates)=>{

    }

    isOnScrollableEdge = (coordinates)=>{
        const scroll_lax = this.layout.width * 0.1
        console.log("coordinates", coordinates);
        if(coordinates.x < scroll_lax){ 
            //Left Edge
            console.log("scroll left");
        }
        else if(coordinates.x > (this.layout.x + this.layout.width) - scroll_lax){
            //Right Edge
            console.log("scroll right");
        }
    }

    componentDidMount(){
        Embassy.addOnStartHandler(this.disableCarouselScroll)
        Embassy.addOnReleaseHandler(this.enableCarouselScroll)

        Embassy.addOnMoveHandler(this._onGestureMove)
    }

    disableCarouselScroll = (coordinates, cb=()=>{})=>{
        this.setState({
            canScroll: false
        },()=>{
            cb()
        })
    }
    
    _onLayout = ({nativeEvent: { layout: {x, y, width, height}}})=>{
        console.log("carousel layedout");
        this.wrapper.current._root.measure((x,y,width,height,pageX,pageY)=>{
            const layout = {
                x: pageX,
                y: pageY,
                width: width,
                height: height
            }
            console.log("Carousel Layout", layout);
            this.layout = layout;
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
            <View 
                ref = {this.wrapper}
                onLayout = {this._onLayout}
                style={{marginTop: 20, height:300}}>
                <Carousel
                    showsHorizontalScrollIndicator = {true}
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