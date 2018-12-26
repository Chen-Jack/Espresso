import React from 'react'
import {Calendar, DateObject} from 'react-native-calendars'
import {TaskSet} from './../../../../Task'
import {Text, View, TouchableOpacity} from 'react-native'
import { Landable, Embassy } from '../TravelingList';
import { Coordinate } from '../../../../utility';
import Day from './Day'
import { Button } from 'native-base';

interface CalendarProps{
    onDayPress : (date: DateObject)=>void
    allocated_tasks : TaskSet[]
}

interface CalendarState{
}

class TaskCalendar extends React.Component<CalendarProps, CalendarState> implements Landable{
    mounted_day_components: any

    constructor(props : CalendarProps) {
        super(props)

        this.mounted_day_components = {}
    }

    register_day_component = (key : string, item: Day)=>{
        this.mounted_day_components[key] = item
    }

    unregister_day_component = (key: string)=>{
       delete this.mounted_day_components[key]
    }
    check = ()=>{
        console.log(Object.keys(this.mounted_day_components).length, this.mounted_day_components);
    }

    componentDidMount(){
        Embassy.registerLandable(this)
    }

    getList = (coordinates : Coordinate): any =>{
        const day_components : Day[] = Object.values(this.mounted_day_components)
        let isOnTop = false
        for (let day of day_components){
            isOnTop = day.isGestureOnTop(coordinates)

            if(isOnTop){
                return day
            }
        }
    }

    // getLayout = (): any=>{
        
    // }

    isGestureOnTop = (coordinates : Coordinate)=>{
        const day_components : Day[] = Object.values(this.mounted_day_components)
        let isOnTop = false
        for (let day of day_components){
            isOnTop = day.isGestureOnTop(coordinates)

            if(isOnTop){
                
                return true
            }
        }
        
        return false
    }

    shouldComponentUpdate(nextProps: CalendarProps){
        if(this.props.allocated_tasks === nextProps.allocated_tasks)
            return false
        else
            return true
    }

    _generateCalendarMarkers = ()=>{
        const markers_list : any = {} 
        for(let task_set of this.props.allocated_tasks){
            const date_iso_form = task_set.date as string
            if(markers_list[date_iso_form] === undefined)
                markers_list[date_iso_form] = {dots: []}

            for(let task of task_set.tasks){
                if(task.completed)
                    markers_list[date_iso_form]["dots"].push({key: task.task_id, color: "blue"})
                else
                    markers_list[date_iso_form]["dots"].push({key: task.task_id, color: "red"})
            }
        }
        
        return markers_list
    }

    _updateMeasurements = ()=>{
        const day_components : Day[] = Object.values(this.mounted_day_components)
        for (let day of day_components){
            day.updateMeasurement()
        }
    }

    _onMonthChange = ()=>{
        this._updateMeasurements()
    }

    render(){

        return <View>
            {/* <Button onPress={this.check}>
                <Text>CHeck</Text>
            </Button> */}

            <Calendar
            onMonthChange={this._onMonthChange}
            // hideExtraDays={true}
            markingType={'multi-dot'}
            // onDayPress={this.props.onDayPress}
            dayComponent={({date, marking, onLongPress, onPress, state}) => {
                // console.log("day component received", date, marking);
                console.log("state is", state);
                return (
                            <Day 
                                date_state = {state}
                                onPress={this.props.onDayPress}
                                markings = {marking !== false ? marking : []}
                                join={this.register_day_component} 
                                leave={this.unregister_day_component} 
                                date={date}/>
                    );
            }}
            markedDates={this._generateCalendarMarkers()}/>
            </View>
    }
}

export default TaskCalendar