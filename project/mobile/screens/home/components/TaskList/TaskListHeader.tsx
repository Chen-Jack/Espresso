import React from 'react'
import { View, Text } from 'react-native'
import { getDay } from './../../../../utility'
import CompletionStatusText from './CompletionStatusText'
import {PopupMenu} from './../PopupMenu'
import { Taskable } from '../../../../Task';
import {Optionable} from './../PopupMenu'

interface TaskListHeaderProps{
    task_list : Taskable[] , 
    date: string
}
    

const TaskListHeader = ({ task_list, date } : TaskListHeaderProps) => {
    return <View style={{ flexDirection: "row", width: "100%", backgroundColor: "#222", alignItems: "center", justifyContent: "space-between" }}>

        {/* Left Side of Header */}
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10, fontSize: 16, color: "white" }}>
                {`${getDay((date))} | ${date || "Date"}`}
            </Text>
            <CompletionStatusText task_list={task_list} />
        </View>

        {/* Right Side of Header */}
        {task_list.length > 0 && <PopupMenu />}

    </View>
}

export default TaskListHeader