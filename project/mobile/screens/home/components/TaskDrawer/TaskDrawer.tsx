import React from 'react'
import SideMenu from 'react-native-side-menu'
import Content from './Content'
import {Embassy, Landable, Focusable} from './../TravelingList'
import {Taskable} from './../../../../Task'
import {Layout, Coordinate} from './../../../../utility'
import { Subscribeable } from '../TravelingList/Embassy';


interface DrawerState{
    visible: boolean,
    gestureInProgress: boolean,
    registered_events: boolean
}

interface DrawerProps{
    unallocated_tasks : Taskable[]
}



export default class TaskDrawer extends React.Component<DrawerProps, DrawerState> implements Landable{
    open_layout : Layout | null
    close_layout: Layout | null

    drawer : any
    content: Content | null

    constructor(props : DrawerProps) {
        super(props)

        this.state = {
            visible: false,
            gestureInProgress : false,
            registered_events: false
        }

        this.open_layout = null;
        this.close_layout = null

        this.content = null;
        this.drawer = React.createRef()

    }

    componentDidMount(){
    }

    componentWillUnmount(){
        console.log("Drawer Unmounting");
    }

    getList = ()  : Focusable | null =>{
        return this.content && this.content.getInnerList()
    }

    getLayout = (): Layout =>{
        if(this.state.visible && this.open_layout)
            return this.open_layout
        
        else if(!this.state.visible && this.close_layout)
            return this.close_layout
        
        return {x:0, y: 0, width:0, height: 0}
    }

    isGestureOnTop = (location : Coordinate)=>{
        /*
        Checks if the given coordinates are ontop of the focused landable
        */
        if(!location.x || !location.y){
            console.log("You forgot params");
            return false
        }
        const layout = this.state.visible ? this.open_layout : this.close_layout

        if(!layout)
            return false
        else{
            const x0 = layout.x
            const y0 = layout.y
            const x1 = layout.x + layout.width 
            const y1 = layout.y + layout.height

            const isWithinX = (x0 < location.x ) && (location.x < x1)
            const isWithinY = (y0 < location.y) && (location.y < y1)

            if( isWithinX && isWithinY ){
                return true
            }
            else{
                return false
            }
        }
    }

    onCardPickedUp = ()=>{
        this.setState({
            visible: false,
            gestureInProgress : true
        })
    }

    onCardReleased = ()=>{
        this.setState({
            visible: true,
            gestureInProgress: false
        })
    }

    _onDrawerOpen = ()=>{
        this.setState({
            visible: true
        })

        console.log("Opened drawer");
        if( !this.state.registered_events){
            this.setState({
                registered_events: true
            }, ()=>{
                Embassy.registerLandable(this)
                Embassy.addOnStartHandlers(this.onCardPickedUp)
                Embassy.addOnReleaseHandlers(this.onCardReleased)
            })
        }

        if(!this.open_layout && this.content){
            this.content.measureLayout((layout : Layout)=>{
                this.open_layout = layout
            })
        }
    }

    _onDrawerClose = ()=>{
        console.log("Closed Drawer");

        this.setState({
            visible: false
        })

        if(!this.state.gestureInProgress){ // Don't remove the events if it's causeed by the events themselves
            this.setState({
                registered_events: false
            }, ()=>{
                Embassy.unregisterLandable(this)
                Embassy.removeOnStartHandlers(this.onCardPickedUp)
                Embassy.removeOnReleaseHandlers(this.onCardReleased)
            })
        }

        if(!this.close_layout && this.content){
            this.content.measureLayout((layout : Layout)=>{
                this.close_layout = layout
            })
        }
    }


    openDrawer : Subscribeable = (_ : Coordinate, cb ?: ()=>void)=>{

        this.setState({
            visible: true
        }, ()=>{
            cb && cb()
        })  
    }

    closeDrawer : Subscribeable = ( _ : Coordinate, cb ?: ()=>void)=>{
        this.setState({
            visible : false
        }, ()=>{
            cb && cb()
        })  

    }



    render(){
        return (
            <SideMenu 
                ref={this.drawer}
                isOpen={this.state.visible}

                disableGestures = {true}
                onChange = {(isOpen : boolean)=>{
                    isOpen ?  this._onDrawerOpen() : this._onDrawerClose()
                }}

                menu = {<Content ref={(ref)=>this.content = ref} task_data = {this.props.unallocated_tasks}/>}>

                {this.props.children}
            </SideMenu>
        )
    }
}
