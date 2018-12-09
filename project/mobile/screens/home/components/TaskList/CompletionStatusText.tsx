import React from 'react'
import { Text } from 'react-native'




const CompletionStatusText = ({ task_list }) => {
    let curr = 0;
    for (let task of task_list) {
        if (task.completed) curr++
    }
    let max = task_list.length

    let style = (curr === max) ? { color: "lightgreen" } : { color: "yellow" }
    return (max > 0) ? <Text style={style}>  {curr} / {max} </Text> : null
}


export default CompletionStatusText