import React from 'react'
import PropTypes from 'prop-types'
import Carousel from 'react-native-snap-carousel'
import {View, Text, Button} from 'native-base'
import {Dimensions} from 'react-native'
import TaskList from './TaskList'
import {Embassy} from '../TravelingList'
import UserTaskConsumer from './../../UserTaskContext'



export default class TaskCarousel extends React.Component{
    constructor(props) {
        super(props)
        
        this.state={
            canScroll : true,
            task_cards_references : []
        }
        this.carousel = React.createRef()
        this.wrapper = React.createRef()

        this.layout = null;

        this.focused_list_from_gesture_start = null;

        this.focused_list = null;
        this.focused_list_layout = null;
        
        //A setinterval timer for when the gesture is ontop of the edge
        this.autoScrollingTimer = null; 

        //There will be a collection of references to each task_list.
        //The references are assigned when the list is rendered.
    }

    _getReference = (index)=>{
        return this[`task_${index}`]
    }
    
    getList = ()=>{
        return this.focused_list
    }

    componentDidMount(){
        Embassy.registerLandable(this)


        const onStartHandlers = [this._onCardPickedUp, this.disableAllListScroll,
            this.disableCarouselScroll]

        const onMoveHandlers = [this._onCardMoved]

        const onReleaseHandlers = [this._onCardReleased, this.enableAllListScroll,
            this.enableCarouselScroll]

        Embassy.addOnStartHandlers(onStartHandlers)
        Embassy.addOnMoveHandlers(onMoveHandlers)
        Embassy.addOnReleaseHandlers(onReleaseHandlers)

    }

    _onSnapHandler = (index)=>{
        this.setState({
            isScrolling : false
        })

        this._handleNewDateSelection(index)

        this.focused_list && this.focused_list.onGestureLoseFocus()
       
        this.updateFocusedListLayout(index)
        
        
    }

    disableAllListScroll = (coordinates)=>{
        //Subscribed Event Handler
        for(let i =0; i<this.props.task_data.length; i++){
            const ref = this._getReference(i)
            ref.toggleScroll(false)
        }
    }

    enableAllListScroll = (coordinates)=>{
        //Subscribed Event Handler
        for(let i =0; i<this.props.task_data.length; i++){
            const ref = this._getReference(i)
            ref.toggleScroll(true)
        }
    }


    _onCardPickedUp = (coordinates, cb=()=>{})=>{
        //Subscribed Event Handler
        this.focused_list_from_gesture_start = this.focused_list

        const direction = this.whichEdgeIsGestureOn(coordinates)
        if(this.autoScrollingTimer === null && (direction === "LEFT" || direction === "RIGHT")){
             this.enableAutoScroller(direction)         
        }
        else if(this.autoScrollingTimer && direction === "NONE"){
             this.disableAutoScroller()
        }
        cb()
    }
    
    _onCardMoved = (coordinates)=>{
        //Subscribed Event Handler
       const direction = this.whichEdgeIsGestureOn(coordinates)
       if(this.autoScrollingTimer === null && (direction === "LEFT" || direction === "RIGHT")){
            this.enableAutoScroller(direction)         
       }
       else if(this.autoScrollingTimer && direction === "NONE"){
            this.disableAutoScroller()
       }
    }
    

    _onCardReleased = (coordinates)=>{
        //Subscribed Event Handler
        this.disableAutoScroller()
    }

    // onHandleReleaseGesture = ()=>{
    //     /*
    //     handler for when a gesture is released on top of this
    //     */
    //    console.log("Captured release");
    //    if(this.focused_list_from_gesture_start !== this.focused_list){
    //     // if(Embassy.origin_target !== Embassy.active_target)
    //         /* Reallocate Task To Different Date */

    //         console.log("Time to reallocate");
    //         const task_id = Embassy.getTraveler().props.task_id
    //         const original_date = this.focused_list_from_gesture_start.getDate();
    //         console.log(original_date);
    //         const new_date = this.focused_list.getDate();
    //         console.log("uh",this.carousel.current.props.reallocateTaskDate);
    //         this.carousel.current.props.reallocateTaskDate(task_id, original_date, new_date)
    //    }
    // }


    enableAutoScroller = (direction)=>{
        const MS_PER_SCROLL = 750

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
        clearInterval(this.autoScrollingTimer)
        this.autoScrollingTimer = null
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



    isGestureOnTop = (location)=>{
        /*
        Checks if the given coordinates are ontop of the focused landable
        */
        if(!location.x || !location.y){
            console.log("You forgot params");
            return false
        }

        if(!this.focused_list_layout)
            return false
        
        const x0 = this.focused_list_layout.x
        const y0 = this.focused_list_layout.y
        const x1 = this.focused_list_layout.x + this.focused_list_layout.width 
        const y1 = this.focused_list_layout.y + this.focused_list_layout.height

        const isWithinX = (x0 < location.x ) && (location.x < x1)
        const isWithinY = (y0 < location.y) && (location.y < y1)

        if( isWithinX && isWithinY ){
            return true
        }
        else{
            return false
        }
        
    }

    enableCarouselScroll = (coordinates, cb=()=>{})=>{
        //Subscribed Event Handler
        this.setState({
            canScroll: true
        }, ()=>{
            cb()
        })
    }

    disableCarouselScroll = (coordinates, cb=()=>{})=>{
        //Subscribed Event Handler
        this.setState({
            canScroll: false
        },()=>{
            cb()
        })
    }
    
    _onLayout = ()=>{
        this.wrapper.current._root.measure((x,y,width,height,pageX,pageY)=>{
            const layout = {
                x: pageX,
                y: pageY,
                width: width,
                height: height
            }
            this.layout = layout;
        })     
    }


    updateToDate = (date)=>{
        const index = this.props.task_data.findIndex((task)=>{
            return task.date === date ? true : false
        })
        if(index)
            this.carousel.current.snapToItem(index)
    }

    _handleNewDateSelection = (data_index)=>{
        const iso_date = this.props.task_data[data_index].date;
        this.props.handleDateSelection(iso_date)
    }

    _renderTaskList = ({item: tasks_of_the_day, index})=>{
        return <View>
            <Text style={{fontSize: 16, backgroundColor:"white", padding: 10}}> {"Date: " + tasks_of_the_day.date || "Date"} </Text>
            <TaskList ref={(ref)=>{this[`task_${index}`] = ref}} index = {index} data = {tasks_of_the_day}/>
        </View>
    }

    updateFocusedListLayout = (index)=>{
        const ref = this._getReference(index)
        ref.measureLayout((layout)=>{
            this.focused_list = ref
            this.focused_list_layout = layout
            console.log("focused layout is now", this.focused_list_layout);
         })
    }

    render(){

        return (
            <UserTaskConsumer>
            { ({setTaskDate}) => <View 
                ref = {this.wrapper}
                onLayout = {this._onLayout}
                style={{marginTop: 20, height:300}}>
                <Carousel
                    ref = {this.carousel}
                    reallocateTaskDate = {setTaskDate}
                    onSnapToItem = {this._onSnapHandler}
                    useScrollView = {true}
                    lockScrollWhileSnapping = {true}
                    showsHorizontalScrollIndicator = {true}
                    scrollEnabled = {this.state.canScroll}
                    data={this.props.task_data}
                    renderItem={this._renderTaskList}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width}
                />
            </View>}
            </UserTaskConsumer>
        )
    }
}

TaskCarousel.propTypes = {
    task_data : PropTypes.array.isRequired,
    handleDateSelection : PropTypes.func
}