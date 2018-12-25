import React from 'react'
import {Calendar} from 'react-native-calendars'
import {TaskSet} from './../../../../Task'

interface CalendarProps{
    onDayPress : (day:any)=>void
    allocated_tasks : TaskSet[]
}

interface CalendarState{
}

class TaskCalendar extends React.Component<CalendarProps, CalendarState>{
    constructor(props : CalendarProps) {
        super(props)

        // this.state = {
        //     markers : {}
        // }
    }

    shouldComponentUpdate(nextProps: CalendarProps){
        if(this.props.allocated_tasks === nextProps.allocated_tasks)
            return false
        else
            return true
    }

    // americanDateToISO = (date : string)=>{
    //     // Date should convert from form mm-dd-yyyy to yyyy-mm-dd
    //     const date_split = date.split("/")

    //     return date_split[2] + "-" + date_split[0] + "-" + date_split[1]

    // }

    _generateCalendarMarkers = ()=>{
        const markers_list : any = {} 
        for(let task_set of this.props.allocated_tasks){
            const date_iso_form = task_set.date as string
            if(markers_list[date_iso_form] === undefined)
                markers_list[date_iso_form] = {dots: []}

            for(let task of task_set.tasks){
                console.log(task);
                if(task.completed)
                    markers_list[date_iso_form]["dots"].push({key: task.task_id, color: "blue"})
                else
                    markers_list[date_iso_form]["dots"].push({key: task.task_id, color: "red"})
            }
        }
        
        console.log("Markers_list", markers_list);
        return markers_list
    }

    render(){

        return <Calendar
            hideExtraDays={true}
            markingType={'multi-dot'}
            onDayPress={this.props.onDayPress}
            markedDates={this._generateCalendarMarkers()}/>
    }
}

export default TaskCalendar