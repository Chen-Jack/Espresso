import React, { SyntheticEvent } from 'react'
import {Text, View, TouchableOpacity} from 'react-native'
import uuid from 'uuid/v4'
import { Coordinate, Layout } from '../../../../utility';
import { Focusable, Transferable } from '../TravelingList';
import { DateObject } from 'react-native-calendars';
import {Embassy} from './../TravelingList'

interface DayProps{
    date: DateObject
    join: any,
    leave: any
    markings: any[]
    onPress: (date: DateObject)=>void
}

class Day extends React.Component<DayProps> implements Focusable, Transferable {
    id: string
    layout: Layout
    wrapper: any

    constructor(props: DayProps) {
        super(props)

        this.id = uuid()
        this.wrapper = null
        this.layout = {
            x:0,
            y:0,
            width:0,
            height:0
        }
    }

    getDate = ()=>{
        return this.props.date.dateString
    }

    onGestureLoseFocus = ()=>{
        console.log(this.props.date.dateString, "lost focus");
        Embassy.materializeTraveler()
    }
    onGestureFocus  = ()=>{
        console.log(this.props.date.dateString, "gained focus");
        Embassy.ghostTraveler()
    }
    onGestureStay = ()=>{
        console.log(this.props.date.dateString, "stayed focus");
    }
    onHandleReleaseGesture = ()=>{
        console.log(this.props.date.dateString, "handled gesture");
    }

    isGestureOnTop = (coordinates : Coordinate)=>{
        if (!coordinates.x || !coordinates.y) {
            console.log("You forgot params");
            return false
        }

        if (!this.layout)
            return false

        const x0 = this.layout.x
        const y0 = this.layout.y
        const x1 = this.layout.x + this.layout.width
        const y1 = this.layout.y + this.layout.height

        const isWithinX = (x0 < coordinates.x) && (coordinates.x < x1)
        const isWithinY = (y0 < coordinates.y) && (coordinates.y < y1)

        if (isWithinX && isWithinY) {
            return true
        }
        else {
            return false
        }
    }

    updateMeasurement = ()=>{
        this.wrapper && this.wrapper.measure((x:number, y: number, width: number, height: number, pageX: number, pageY: number)=>{
            const layout : Layout = {
                x : pageX,
                y : pageY,
                width,
                height
            }

            this.layout = layout
        })
    }

    _onLayout = ()=>{
        // console.log("Initialiazing measurements for", this.props.date.dateString);
        this.updateMeasurement()
    }

    shouldComponentUpdate(nextProps : DayProps){
        if(this.props === nextProps)
            return false
        else
            return true
    }

    componentDidMount(){
        this.props.join(this.id, this)
        console.log(this.props.date.month, this.props.date.day, "mounted");
    }

    componentWillUnmount(){
        this.props.leave(this.id)
        console.log(this.props.date.month, this.props.date.day, "Unmounted");
    }

    render(){
        return <TouchableOpacity onPress={()=>this.props.onPress(this.props.date)}  style={{flex:1, backgroundColor:"purple"}}>
                <View style={{width:"100%"}} ref={ ref => this.wrapper = ref} onLayout={this._onLayout}>
            <Text style={{width:"100%", textAlign:"center"}}> {this.props.date.day} </Text>
        </View>
        </TouchableOpacity>
    }
}

export default Day