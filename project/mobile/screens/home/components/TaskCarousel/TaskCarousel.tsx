import React from 'react'
import Carousel from 'react-native-snap-carousel'
import {View, Text, Button, Icon} from 'native-base'
import {Dimensions, TouchableOpacity} from 'react-native'
import {TaskList} from '../TaskList'
import {Embassy, LandableContainer} from '../TravelingList'
import {UserTaskContext} from './../../Context'
import Loader from './LoadingCarouselView'
import {TaskCard} from './../TaskCard'
import {Layout, Coordinate} from '../../../../utility'
import {Taskable} from './../../../../Task'
import {TaskSet} from './../../home'
import Landable from '../TravelingList/Landable';

interface TaskCarouselProps{
    isLoading : boolean
    task_data : TaskSet[]
    handleDateSelection : any,
    // selected_date: string
}

interface TaskCarouselState{
    canScroll: boolean,
    task_cards_references : TaskCard[]
}

export default class TaskCarousel extends React.Component<TaskCarouselProps, TaskCarouselState> implements LandableContainer{
    STARTING_INDEX : number
    carousel: React.RefObject<Carousel>
    wrapper: any
    layout: any

    focused_list_from_gesture_start: TaskList | null
    focused_list: TaskList | null
    focused_list_layout : Layout | null

    //A setinterval timer for when the gesture is ontop of the edge
    autoScrollingTimer : any 

    constructor(props) {
        super(props)

        this.state={
            canScroll : true,
            task_cards_references : []
        }

        this.STARTING_INDEX = 14;

        this.carousel = React.createRef()
        this.wrapper = React.createRef()

        this.focused_list_from_gesture_start = null;
        this.focused_list = null
        this.focused_list_layout = null


        //There will be a collection of references to each task_list.
        //The references are assigned when the list is rendered.
    }

    componentWillUnmount(){
        console.log("Carousel Unmounting");
    }


    _getReference = (index : number)=>{
        return this[`task_${index}`]
    }

    getList = () : Landable | null =>{
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

    _onSnapHandler = (index : number)=>{
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
    
    _onCardMoved = (coordinates : Coordinate)=>{
        //Subscribed Event Handler
       const direction = this.whichEdgeIsGestureOn(coordinates)
       console.log("DIRECTION WAS", direction);
       if(!this.autoScrollingTimer && (direction === "LEFT" || direction === "RIGHT")){
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


    enableAutoScroller = (direction)=>{
        const MS_PER_SCROLL = 400

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

  

    whichEdgeIsGestureOn = (coordinates : Coordinate)=>{
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



    isGestureOnTop = (gesture_coordinates : Coordinate)=>{
        /*
        Checks if the given coordinates are ontop of the focused landable
        */
        if(!gesture_coordinates.x || !gesture_coordinates.y){
            console.log("You forgot params");
            return false
        }

        if(!this.focused_list_layout)
            return false
        
        const x0 = this.focused_list_layout.x
        const y0 = this.focused_list_layout.y
        const x1 = this.focused_list_layout.x + this.focused_list_layout.width 
        const y1 = this.focused_list_layout.y + this.focused_list_layout.height

        const isWithinX = (x0 < gesture_coordinates.x ) && (gesture_coordinates.x < x1)
        const isWithinY = (y0 < gesture_coordinates.y) && (gesture_coordinates.y < y1)

        if( isWithinX && isWithinY ){
            return true
        }
        else{
            return false
        }
        
    }

    enableCarouselScroll = (coordinates : Coordinate, cb=()=>{})=>{
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


    updateToDate = (date : string)=>{
        const index = this.props.task_data.findIndex((task)=>{
            return task.date === date ? true : false
        })
        if(index)
            this.carousel.current.snapToItem(index)
    }

    _handleNewDateSelection = (data_index : number)=>{
        const iso_date = this.props.task_data[data_index].date;
        this.props.handleDateSelection(iso_date)
    }


    _renderTaskList = ({item: task_set, index} : {item: TaskSet, index: number})=>{

        return <View style={{ margin: 20, height: "85%", width: "85%", backgroundColor: "#ddd", borderRadius: 10, alignSelf:"center"}}>
            <TaskList initialize={(index === this.STARTING_INDEX) ? this._initializeLayout : null} 
                ref={(ref)=>{this[`task_${index}`] = ref}} 
                index = {index} 
                data = {task_set}/>
        </View>
    }

    updateFocusedListLayout = (index : number)=>{
        const ref = this._getReference(index)
        ref.measureLayout((layout)=>{
            this.focused_list = ref
            this.focused_list_layout = layout
         })
    }

    _initializeLayout = (list : TaskList, layout : Layout)=>{
        console.log("Initialized Carousel's first Item");
        this.focused_list = list
        this.focused_list_layout = layout
    }


    render(){

        return (
            <UserTaskContext.Consumer>
                { ({setTaskDate} : any) => <View 
                    ref = {this.wrapper}
                    onLayout = {this._onLayout}
                    style={{ flexDirection:"column", flex: 1 , width:"100%", marginBottom: 50, paddingBottom:10, backgroundColor: "#2460c1"}}>
                    
                    {
                        (this.props.isLoading) ? <Loader/> : <Carousel
                            firstItem={this.STARTING_INDEX}
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
                    }

                </View>}
            </UserTaskContext.Consumer>
        )
    }
}
