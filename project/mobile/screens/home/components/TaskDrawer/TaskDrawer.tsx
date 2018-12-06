import React from 'react'
import SideMenu from 'react-native-side-menu'
import PropTypes from 'prop-types'
import Content from './Content'
import {Embassy} from './../TravelingList'
import {Taskable} from './../../../../Task'
import {Layout} from './../../../../utility'

interface DrawerState{
    visible: boolean
}

interface DrawerProps{
    unallocated_tasks : Taskable[]
}



export default class TaskDrawer extends React.Component<DrawerProps, DrawerState>{
    layout : Layout
    drawer : any
    content: any

    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }

        this.layout = null;
        this.drawer = React.createRef()

    }

    componentDidMount(){
        Embassy.addOnStartHandlers(this.closeDrawer)
    }

    componentWillMount(){
        console.log("Drawer Unmounting");
    }

    isGestureOnTop = (location : Layout)=>{
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

    _onDrawerOpen = ()=>{
        Embassy.registerLandable(this)

        if(!this.layout){
            this.content.measureLayout((layout)=>{
                this.layout = layout
            })
        }
    }

    _onDrawerClose = ()=>{
        Embassy.unregisterLandable(this)
    }


    openDrawer = (coordinates, cb=()=>{})=>{
        this.setState({
            visible: true
        }, ()=>{
            this._onDrawerOpen()
            cb()
        })  
    }

    closeDrawer = (coordinates, cb=()=>{})=>{
        this.setState({
            visible : false
        }, ()=>{
            this._onDrawerClose()
            cb()
        })  

    }



    render(){
        return (
            <SideMenu 
                ref={this.drawer}
                isOpen={this.state.visible}

                onClose={this.closeDrawer}
                disableGestures = {true}
                onChange = {(isOpen)=>{
                    this.setState({
                        visible: isOpen
                    })
                }}

                menu = {<Content ref={(ref)=>this.content = ref} task_data = {this.props.unallocated_tasks}/>}>

                {this.props.children}
            </SideMenu>
        )
    }
}
