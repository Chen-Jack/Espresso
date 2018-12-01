import React from 'react'
import {View, Text, FlatList} from 'react-native'
import TaskCard from './TaskCard'
import PropTypes from 'prop-types'

const EmptyList = (props)=>{
    console.log("Empty list created");
    return <View style={{fontSize: 20, opacity:0.7, height:"100%", width:"100%", backgroundColor: "white", alignItems:"center", justifyContent:"center"}}>
        <Text>
            Looks Empty...
        </Text>
    </View>
}

export default class TaskList extends React.Component{
    constructor(props) {
        super(props)

        this.list = React.createRef()
        this.layout = null

        this.state = {
            isGestureHovering: false,
            canScroll : true,
            editMode: false
        }
    }

    toggleEditMode = ()=>{
        this.setState({
            editMode :  !this.state.editMode
        })
    }
    componentWillUnmount(){
        console.log("TaskList unmounting");
    }

    _renderListItem = ({item,index})=>{
        return (
            <TaskCard 
                parent_list = {this} 
                task_id={item.task_id} 
                title={item.title} 
                date={item.allocated_date} 
                details={item.details} 
                isEditMode = {this.state.isEditMode}
                isCompleted={item.completed}/>
        )  
    }

    _onEnterHandler = ()=>{
        console.log("setting");
        this.setState({
            isGestureHovering: true
        })
    }

    _onLeaveHandler = ()=>{
        console.log("unsetting");
        this.setState({
            isGestureHovering: false
        })
    }

    measureLayout = (cb=()=>{})=>{
        this.list.current.measure((x,y,width,height,pageX,pageY)=>{
            const layout = {
                x: pageX,
                y: pageY,
                width: width,
                height: height
            }
            this.layout = layout
            cb(layout)
        })
    }

    
    getDate = ()=>{
        return this.props.data.date || null
    }

    toggleScroll = (status = null)=>{
        this.setState({
            canScroll : status ? status : !this.state.canScroll
        })
    }

    onGestureStay = ()=>{
        console.log(`${this.props.data.date} still focused`);
    }

    onGestureFocus = ()=>{
        console.log(`${this.props.data.date} is focused`);
        // this._onEnterHandler()
    }

    onGestureLoseFocus = ()=>{
        console.log(`${this.props.data.date} lost focus`);
        // this._onLeaveHandler()
    }

    onHandleReleaseGesture = ()=>{
        console.log(`${this.props.data.date } captured the released gesture`);
    }

    onLayoutHandler = ()=>{
        if(this.props.initialize)
            this.measureLayout((layout)=>{
                console.log("uhhh", this.props.initialize);
                if(this.props.initialize){
                    this.props.initialize(this, layout, this.props.index)
                }
            })
    }

    render(){
        let focus_style = {backgroundColor: (this.state.isGestureHovering ? "yellow" : null)}
        let landable_style = {flex: 1, ...focus_style}

        return <View 
                onLayout={this.onLayoutHandler}
                ref={this.list} 
                style={{flex: 1}}>

                { this.props.data.tasks.length === 0 ?     
                    <EmptyList/> :   
                    <FlatList
                        scrollEnabled = {this.state.canScroll}
                        index = {this.props.index}
                        data = {this.props.data.tasks}
                        renderItem = {this._renderListItem}
                        style={landable_style}/>
                }

        </View>
    }
}

TaskList.propTypes = {
    initialize : PropTypes.func,
    data: PropTypes.shape({
        date :PropTypes.string,
        tasks: PropTypes.array.isRequired
    }).isRequired
}