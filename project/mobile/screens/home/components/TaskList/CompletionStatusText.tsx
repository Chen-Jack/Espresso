import React from 'react'
import { Text } from 'react-native'
import {Taskable} from './../../../../Task'

interface TextProps{
    task_list : Taskable[]
}

const CompletionStatusText : React.FunctionComponent<TextProps> = ({ task_list }) => {
    let curr = 0;
    for (let task of task_list) {
        if (task.completed) curr++
    }
    let max = task_list.length

    let style = (curr === max) ? { color: "lightgreen" } : { color: "yellow" }
    return (max > 0) ? <Text style={style}>  {curr} / {max} </Text> : null
}


export default CompletionStatusText