import React from 'react'
import {View, Text, Dimensions} from 'react-native'
import SideMenu from 'react-native-side-menu'
import TaskList from '../TaskCarousel/TaskList'
import PropTypes from 'prop-types'
import {Embassy} from './../TravelingList'

class DrawerContent extends React.Component{
    constructor(props) {
        super(props)
        this.drawer = React.createRef()
    }

    measureLayout = (cb=()=>{})=>{
        this.drawer.current.measure((x,y,width,height,pageX,pageY)=>{
            const layout = {
                x: pageX,
                y: pageY,
                width: width,
                height: height
            }
            cb(layout);
        })     
    }


    render(){

        return (
        <View style={{backgroundColor: "darkblue", height: Dimensions.get('window').height, width: "100%"}}>
            <View style={{padding: 0, margin:0, alignItems: "center", justifyContent:"center", backgroundColor:"#222", height: "25%", width:"100%"}}>
                <Text style={{ fontSize:20, color:"white"}}> Unallocated Tasks </Text>
            </View>
            <View 
                style={{padding:10, width:"100%", height:"100%"}}>
                <TaskList
                    ref={(ref)=>{this.list}}
                    data = {{
                        date: null,
                        tasks: this.props.task_data
                    }}
                />
            </View>
        </View>
        )
    }
}

DrawerContent.propTypes = {
    task_data : PropTypes.array.isRequired
}

export default class TaskDrawer extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }

        this.layout = null;
        
        this.drawer = React.createRef()

    }

    componentDidMount(){
        // Embassy.registerLandable(this)

        // Embassy.addOnStartHandlers(this.closeDrawer)
    }

    componentWillUnmount(){
        console.log("unmounted");
    }

    isGestureOnTop = ()=>{
        /*
        Checks if the given coordinates are ontop of the focused landable
        */
        if(!location.x || !location.y){
            console.log("You forgot params");
            return false
        }

        if(!this.layout)
            return false

        const x0 = this.layout.x
        const y0 = this.layout.y
        const x1 = this.layout.x + this.layout.width 
        const y1 = this.layout.y + this.layout.height

        const isWithinX = (x0 < location.x ) && (location.x < x1)
        const isWithinY = (y0 < location.y) && (location.y < y1)

        if( isWithinX && isWithinY ){
            return true
        }
        else{
            return false
        }
    }
    onGestureFocus = ()=>{

    }
    onGestureLoseFocus = ()=>{

    }
    onGestureStay = ()=>{

    }
    onHandleReleaseGesture = ()=>{
    }

    onDrawerOpen = ()=>{
        Embassy.registerLandable(this)
        if(!this.layout){
            this.drawer_content.measureLayout((layout)=>{
                this.layout = layout
                console.log("Cool, the drawer is", this.layout);
            })
        }
    }

    onDrawerClose = ()=>{
        Embassy.unregisterLandable(this)
    }

    closeDrawer = (coordinates, cb=()=>{})=>{
        this.toggleDrawer(false, (err)=>{
            if(err)
                cb(err)
            else{
                this.onDrawerClose()
                cb()
            }
        })

    }

    toggleDrawer = (toggleState, cb =()=>{}) =>{
        const next_state = (toggleState !== null ? toggleState : !this.state.visible)
        this.setState({
            visible: next_state
        }, ()=>{
            if(next_state === false){
                this.onDrawerClose()
            }
            else{
                this.onDrawerOpen()
            }
            cb()
        })
    }

 
    _renderListItem = ({item,index})=>{
        return (
            <TaskCard task_id={item.id} allocated_date={item.allocated_date} title={item.title} details={item.details} isCompleted={item.completed}/>
        )  
    }


    render(){
        return (
            <SideMenu 
                onClose={this.closeDrawer}
                ref={this.drawer}
                isOpen={this.state.visible}
                disableGestures = {true}
                onChange = {(isOpen)=>{
                    this.setState({
                        visible: isOpen
                    })
                }}
                menu = {<DrawerContent ref={(ref)=>this.drawer_content = ref} task_data = {this.props.task_data}/>}>

                {this.props.children}
            </SideMenu>
        )
    }
}