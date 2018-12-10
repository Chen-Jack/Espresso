import React from 'react'
import SideMenu from 'react-native-side-menu'
import Content from './Content'
import {Embassy, Landable, Focusable, Transferable} from './../TravelingList'
import {Taskable} from './../../../../Task'
import {Layout, Coordinate} from './../../../../utility'
import { Subscribeable } from '../TravelingList/Embassy';


interface DrawerState{
    visible: boolean
}

interface DrawerProps{
    unallocated_tasks : Taskable[]
}



export default class TaskDrawer extends React.Component<DrawerProps, DrawerState> implements Landable{
    layout : Layout | null
    drawer : any
    content: Content | null

    constructor(props : DrawerProps) {
        super(props)

        this.state = {
            visible: false
        }

        this.layout = null;
        this.content = null;
        this.drawer = React.createRef()

    }

    componentDidMount(){
        Embassy.addOnStartHandlers(this.closeDrawer)
    }

    componentWillUnmount(){
        console.log("Drawer Unmounting");
    }

    getList = ()  : Focusable | null =>{
        return this.content && this.content.getInnerList()
    }

    isGestureOnTop = (location : Coordinate)=>{
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

        if(!this.layout && this.content){
            this.content.measureLayout((layout : Layout)=>{
                this.layout = layout
            })
        }
    }

    _onDrawerClose = ()=>{
        Embassy.unregisterLandable(this)
    }


    openDrawer : Subscribeable = (_ : Coordinate, cb ?: ()=>void)=>{
        this.setState({
            visible: true
        }, ()=>{
            this._onDrawerOpen()
            cb && cb()
        })  
    }

    closeDrawer : Subscribeable = ( _ : Coordinate, cb ?: ()=>void)=>{
        this.setState({
            visible : false
        }, ()=>{
            this._onDrawerClose()
            cb && cb()
        })  

    }



    render(){
        return (
            <SideMenu 
                ref={this.drawer}
                isOpen={this.state.visible}

                onClose={this.closeDrawer}
                disableGestures = {true}
                onChange = {(isOpen : boolean)=>{
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
