// import React from 'react'
// import {AsyncStorage} from 'react-native'
// import update from 'immutability-helper'

// export default class TaskStateManager extends React.Component{

//     addTaskToState = ()=>{

//     }

//     removeTaskFromState = ()=>{

//     }

//     static updateCompletionStatusOfState = (task_id, new_status, cb=()=>{})=>{
//         AsyncStorage.getItem("session_token", (err, session_token)=>{
//             const data = {
//                 task_id: task_id,
//                 completion_status: new_status
//             }
//             fetch("http://localhost:3000/toggle-task-completion", {
//                 method: 'POST',
//                 headers: {
//                     "Authorization": `Bearer ${session_token}`,
//                     "Content-Type": "application/json; charset=utf-8",
//                 },
//                 body : JSON.stringify(data)
//             }).then(
//                 (res)=>{
//                     if(res.ok){
//                         console.log("Updating completion of task");
//                         let found = false;
       
                        
//                         //First Search Through Allocated Tasks
//                         for(let day_index in this.props.allocated_tasks){
//                             let day_tasks = this.props.allocated_tasks[day_index].tasks
//                             for(let task_index in day_tasks){
//                                 if(day_tasks[task_index].id === task_id){
//                                     const new_state = update(this.props.allocated_tasks, {[day_index]: {tasks: {[task_index] : {completed: {$set : new_status}}}}});
//                                     found = true;
//                                     this.setState({
//                                         allocated_tasks : new_state
//                                     })
//                                 }
//                             }
//                         }
                    

//                         //Search through unallocated tasks if still haven't found
//                         if(!found){
//                             for(let i in this.props.unallocated_tasks){
//                                 if(this.props.unallocated_tasks[i].id === task_id){
//                                     new_state = update(this.props.unallocated_tasks, {[i] : {isCompleted: {$set, new_status}}})
//                                     console.log("found unallocated");
//                                     this.setState({
//                                         unallocated_tasks : new_state
//                                     })
//                                 }
//                             }
//                         }

//                         cb()
//                     }

//                     else{
//                         cb("Res not ok")
//                     }
//                 }
//             ).catch((err)=>{
//                 console.log("Error when toggling tasks", err)
//                 cb(err)
//                 alert("Error")
//             })
//         })
//     }

//     static allocateTaskToDate = (task_id, original_date, new_date, cb=()=>{})=>{
//         const original_state = this.props.allocated_tasks

//         let original_task = null;
//         let day_index_original = null
//         let task_index_original = null

//         let day_index_updated = null
        
//         //Visually Update before fetching. 

//         //Gather variables to know what to mutate
//         for(let day_index in this.props.allocated_tasks){
//             let day_tasks = this.props.allocated_tasks[day_index].tasks
//             date = this.props.allocated_tasks[day_index].date

//             if(date === new_date){
//                 day_index_updated = day_index
//             }
            
//             for(let task_index in day_tasks){
//                 if(day_tasks[task_index].id === task_id){
//                     original_task = day_tasks[task_index]
//                     day_index_original = day_index
//                     task_index_original = task_index
//                 }
//             }
//         }
        

//         const updated_task = update(original_task , {allocated_date : {$set : new_date} })
//         const new_state = update(this.props.allocated_tasks, 
//             {
//                 [day_index_updated]: { //Add Item To New Date
//                     tasks: {
//                         $push: [updated_task]
//                     }
//                 },
//                 [day_index_original] : { // Remove Item from Old Date
//                     tasks: {
//                         $splice: [[task_index_original, 1]]
//                     }
//                 }
//             }
//         );

//         this.setState({
//             allocated_tasks : new_state
//         })
    

//         AsyncStorage.getItem("session_token", (err, session_token)=>{
//             if(err)
//                 return console.log("ERROR WHEN RETRIEVING SESSION TOKEN")
                
//             const data = {
//                 task_id: task_id,
//                 new_date: new_date
//             }
//             fetch("http://localhost:3000/allocate-task", {
//                 method: 'POST',
//                 headers: {
//                     "Authorization": `Bearer ${session_token}`,
//                     "Content-Type": "application/json; charset=utf-8",
//                 },
//                 body : JSON.stringify(data)
//             }).then(
//                 (res)=>{
//                     if(res.ok){
                
//                         cb()
//                     }

//                     else{
//                         this.setState({
//                             allocated_tasks : original_state
//                         })
//                         cb("Res not ok")
//                     }
//                 }
//             ).catch((err)=>{

//                 this.setState({
//                     allocated_tasks : original_state
//                 })

//                 console.log("Error when allocateTaskToDate", err)
//                 cb(err)
//                 alert("Error")
//             })
//         })
//     }



// }