import React from 'react'
import PropTypes from 'prop-types'
import Carousel from 'react-native-snap-carousel'
import {View, Text, Button} from 'native-base'
import {Dimensions} from 'react-native'
import TaskList from './TaskList'
import {Embassy} from '../TravelingList'

import update from 'immutability-helper'


export default class TaskCarousel extends React.Component{
    constructor(props) {
        super(props)
        
        this.state={
            canScroll : true,
            isScrolling : false,
            task_cards_references : []
        }
        this.carousel = React.createRef()
        this.wrapper = React.createRef()

        this.layout = null;
        this.focused_card_layout = null;
        
        //A setinterval timer for when the gesture is ontop of the edge
        this.autoScrollingTimer = null; 

        //There will be a collection of references to each task_list.
        //The references are assigned when the list is rendered.
    }

    componentDidMount(){
        Embassy.addOnStartHandler(this.disableCarouselScroll)
        Embassy.addOnReleaseHandler(this.enableCarouselScroll)

        Embassy.addOnMoveHandler(this._onGestureMove)
        Embassy.addOnReleaseHandler(this._onGestureRelease)
    }

    onSnapHandler = (index)=>{
        this.setState({
            isScrolling : false
        })
        console.log("SNAPPED");

        this._handleCardSelection(index)

        const task_list_ref = this._getReactReference(index)
        if(task_list_ref){
            task_list_ref.measureLayout((layout)=>{
                console.log("the layout is now", layout);
                this.focused_card_layout = layout
            })
        }
    }

    _onGestureStart = (coordinates)=>{
        
    }
    
    _onGestureMove = (coordinates)=>{
       const direction = this.whichEdgeIsGestureOn(coordinates)
       if(this.autoScrollingTimer === null && (direction === "LEFT" || direction === "RIGHT")){
           console.log("enabling auto scroller for", direction);
            this.enableAutoScroller(direction)         
       }
       else if(this.autoScrollingTimer && direction === "NONE"){
           console.log("eliseif called");
            this.disableAutoScroller()
       }
    }


    enableAutoScroller = (direction)=>{
        const MS_PER_SCROLL = 750
        // console.log("AUTO SCROLL ENABLED");

        this.autoScrollingTimer = setInterval(() => {
            if(direction === "RIGHT"){
                this.carousel.current.snapToNext()
            }
            else if(direction === "LEFT"){
                this.carousel.current.snapToPrev()
            }
            else if(direction === "NONE"){
                
            }
            else{
                console.log("Receieved invalid direction in enableAutoScroller");
            }
        }, MS_PER_SCROLL);
    }

    disableAutoScroller = ()=>{
        // console.log("auto scroller DISABLED");
        clearInterval(this.autoScrollingTimer)
        this.autoScrollingTimer = null
    }

    _onGestureRelease = (coordinates)=>{
        this.disableAutoScroller()
    }

    whichEdgeIsGestureOn = (coordinates)=>{
        /*
        Checks to see if the given coordinates should trigger a carousel scroll
        */
        const scroll_lax = this.layout.width * 0.2
        if(coordinates.x < scroll_lax){ 
            return "LEFT"
        }
        else if(coordinates.x > (this.layout.x + this.layout.width) - scroll_lax){
            return "RIGHT"
        }
        else{
            return "NONE"
        }
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

    _getReactReference = (index)=>{
        return this[`task_${index}`]
    }

    _renderTaskList = ({item: tasks_of_the_day, index})=>{
        return <View>
            <Text style={{fontSize: 16, backgroundColor:"white", padding: 10}}> {"Date: " + tasks_of_the_day.date || "Date"} </Text>
            <TaskList ref={(ref)=>{this[`task_${index}`] = ref}} index = {index} data = {tasks_of_the_day.tasks}/>
        </View>
    }

    render(){

        return (
            <View 
                ref = {this.wrapper}
                onLayout = {this._onLayout}
                style={{marginTop: 20, height:300}}>
                <Button onPress={()=>{
                    console.log(this.focused_card_layout);
                }}>
                    <Text> Focused Layout Measurements</Text>
                </Button>
                <Carousel
                    onSnapToItem = {this.onSnapHandler}
                    useScrollView = {true}
                    lockScrollWhileSnapping = {true}
                    showsHorizontalScrollIndicator = {true}
                    scrollEnabled = {this.state.canScroll}
                    ref = {this.carousel}
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