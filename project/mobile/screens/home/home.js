//The home page for an account

import React from 'react'
import {Title, Header, Body,Footer, FooterTab, Container, Content, Text, Button, Toast, Icon} from 'native-base'
import {AsyncStorage, View, Dimensions, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-calendars';
import {TaskCarousel} from './components/TaskCarousel'
import {TaskCreationPrompt} from './components/TaskForm'
import {TaskDrawer} from './components/TaskDrawer'
import UserTaskContext, {UserTaskProvider} from './UserTaskContext'
import update from 'immutability-helper'
import { Embassy } from './components/TravelingList';
import Task from './../../Task'
import {getDay} from './../../utility'




class HomeScreen extends React.Component{
    constructor(props) {
        super(props)
        console.disableYellowBox = true;
        this.state = {
            user : {
                username: ""
            },
            isLoading : true,
            unallocated_tasks : [],
            allocated_tasks : [],
            selected_date: new Date().toISOString().substring(0,10),
            promptTaskCreation: false,
        }   

        this.carousel = React.createRef()
        this.calendar = React.createRef()

        this.today = new Date()

        this.manager = {
            updateStatus : this.updateCompletionStatusOfState,
            reallocateTask : this.reallocateTask,
            deallocateTask : this.deallocateTask,
            allocateTask : this.allocateTask,
            createTask : this.createTask,
            deleteTask : this.deleteTask,
            editTask: this.editTask,
            deallocateTasksFromDate : this.deallocateTasksFromDate
        }

        //Give the Embassy access to the same context manager
        Embassy.setManager(this.manager) 
     
    }

    static navigationOptions = {
        header: null,
        gesturesEnabled: false, // Prevent swipe back
    };

    static getTaskManager = ()=>{
        return this.manager
    }

    updateCompletionStatusOfState = (task_id, new_status, cb=()=>{})=>{
        console.log("Updating completion of task to", new_status);

        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        let found = false;        
        //First Search Through Allocated Tasks
        for(let day_index in this.state.allocated_tasks){
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            for(let task_index in day_tasks){
                if(day_tasks[task_index].task_id === task_id){
                    const new_state = update(this.state.allocated_tasks, {[day_index]: {tasks: {[task_index] : {completed: {$set : new_status}}}}});
                    found = true;

                    original_state = this.state.allocated_tasks
                    this.setState({
                        allocated_tasks : new_state
                    }, ()=>console.log("allocated state was set to", this.state.allocated_tasks))
                }
            }
        }
    

        //Search through unallocated tasks if still haven't found
        if(!found){
            for(let i in this.state.unallocated_tasks){
                if(this.state.unallocated_tasks[i].task_id === task_id){
                    new_state = update(this.state.unallocated_tasks, {[i] : {completed: {$set : new_status}}})
                    
                    original_state = this.state.unallocated_tasks
                    this.setState({
                        unallocated_tasks : new_state
                    }, ()=>console.log("unallocated state was set to", this.state.unallocated_tasks))
                }
            }
        }
            
        Task.updateStatus(task_id, new_status, (err)=>{
            if(err){
                this.setState({
                    allocated_tasks : original_allocated_state,
                    unallocated_tasks : original_unallocated_state
                })
            }
        })

    }

    allocateTask = (task_id, new_date, cb=()=>{})=>{
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        let original_task = {};
        let day_index_updated = null
        let task_index_original = null

        //Search through your state to know what indexes to update
        for(let task_index in this.state.unallocated_tasks){
            let task = this.state.unallocated_tasks[task_index]
            
            if(task.task_id === task_id){
                Object.assign(original_task , task)
                original_task.allocated_date = new_date
                task_index_original = task_index
            }
            
        }
        for(let day_index in this.state.allocated_tasks){
            let date = this.state.allocated_tasks[day_index].date
            if(date == new_date){
                day_index_updated = day_index
                break
            }
        }

        
        new_unallocated_state = update(this.state.unallocated_tasks, {
            $splice: [[task_index_original, 1]]
        })
        new_allocated_state = update(this.state.allocated_tasks, {
            [day_index_updated] : {
                tasks : {
                    $unshift : [original_task]
                }
            }
        })

        this.setState({
            unallocated_tasks : new_unallocated_state,
            allocated_tasks : new_allocated_state
        }, ()=>{
            Toast.show({
                text: `Task was assigned to ${new_date}`,
                buttonText: 'Ok'
              })
        })

        Task.allocateTask(task_id, new_date, (err)=>{
            if(err){
                this.setState({
                    unallocated_tasks : original_unallocated_state,
                    allocated_tasks : original_allocated_state
                })
            }
        })
       
    }

    deallocateTasksFromDate = (target_date, cb=()=>{})=>{
        console.log("deallocating all tasks on date", target_date);
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        const original_task_array = []
        let original_date_index = null;

        //Search through your state to know what indexes to update
        for(let day_index in this.state.allocated_tasks){
            let date = this.state.allocated_tasks[day_index].date
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            if(date === target_date){
                original_date_index = day_index
                original_task_array.push(...day_tasks)
            }
        }

        const new_allocated_state = update(this.state.allocated_tasks, 
            {
                [original_date_index] : { // Remove Item from Old Date
                    tasks: {
                        $set: []
                    }
                }
            }
        );

        const new_unallocated_state = update(this.state.unallocated_tasks, {
            $push : original_task_array
        })

        this.setState({
            allocated_tasks : new_allocated_state,
            unallocated_tasks : new_unallocated_state
        }, ()=>{
            Toast.show({
                text: 'All of your tasks were moved back to your board!',
                buttonText: 'Got it'
              })
        })

        
        Task.allocateMultipleTasks(original_task_array.map(task=>task.task_id, null, (err)=>{
            if(err){
                console.log("ERROR DEALLOCATING EVERYTHING");
                this.setState({
                    allocateTask: original_allocated_state,
                    unallocated_tasks: original_unallocated_state
                })
            }
        }))
        
    }

    deallocateTask = (task_id, cb=()=>{}) => {
        console.log("deallocating");
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        let original_task = {};
        let day_index_original = null
        let task_index_original = null

        //Search through your state to know what indexes to update
        for(let day_index in this.state.allocated_tasks){
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            
            for(let task_index in day_tasks){
                if(day_tasks[task_index].id === task_id){
                    Object.assign(original_task , day_tasks[task_index])
                    day_index_original = day_index
                    task_index_original = task_index
                }
            }
        }

        const new_allocated_state = update(this.state.allocated_tasks, 
            {
                [day_index_original] : { // Remove Item from Old Date
                    tasks: {
                        $splice: [[task_index_original, 1]]
                    }
                }
            }
        );

        const new_unallocated_state = update(this.state.unallocated_tasks, {
            $push : [original_task]
        })

        this.setState({
            allocated_tasks : new_allocated_state,
            unallocated_tasks : new_unallocated_state
        }, ()=>{
            Toast.show({
                text: 'Task was moved back to your board!',
                buttonText: 'Got it'
              })
        })

        Task.allocateTask(task_id, null, (err)=>{
        
        })
    }

    reallocateTask = (task_id, new_date, cb=()=>{})=>{
        /*
        Uses an optomistic UX approach. Update the UI before API actually
        finishes.
        */
        
        //Keep original_state incase of failed API call
        const original_state = this.state.allocated_tasks

        let original_task = {};
        let day_index_original = null
        let task_index_original = null
        let day_index_updated = null
        
        //Gather variables to know what to mutate
        for(let day_index in this.state.allocated_tasks){
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            date = this.state.allocated_tasks[day_index].date

            if(date === new_date){
                day_index_updated = day_index
            }
            
            for(let task_index in day_tasks){
                if(day_tasks[task_index].task_id === task_id){
                    Object.assign(original_task, day_tasks[task_index])
                    day_index_original = day_index
                    task_index_original = task_index
                }
            }   
            
        }

        const updated_task = update(original_task , {allocated_date : {$set : new_date} })
        const new_state = update(this.state.allocated_tasks, 
            {
                [day_index_updated]: { //Add Item To New Date
                    tasks: {
                        $unshift: [updated_task]
                    }
                },
                [day_index_original] : { // Remove Item from Old Date
                    tasks: {
                        $splice: [[task_index_original, 1]]
                    }
                }
            }
        );

        this.setState({
            allocated_tasks : new_state
        })
    

        Task.allocateTask(task_id, new_date, (err)=>{
            if(err){
                this.setState({
                    allocated_tasks:  original_state
                }, ()=>{
                    console.log("Error with updating task date", err);
                    alert("Error with api call")
                })
            }
        })
    }

    createTask = (title, details, cb=()=>{})=>{
        console.log("Create Task!!!!");
        const original_state = this.unallocated_tasks

        Task.createTask(title, details, (err, new_task)=>{
            if(err){
                this.setState({
                    unallocated_tasks : original_state
                },cb)
            }
            else{
                console.log("new task is", new_task);
                const new_state = update(this.state.unallocated_tasks, {
                    $unshift : [new_task]
                })
                this.setState({
                    unallocated_tasks : new_state
                }, cb)
            }
        })

    }

    deleteTask = (task_id, cb=()=>{})=>{
        console.log("DELETING", task_id);
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        let day_index_original = null
        let task_index_original = null
        
        //Search through allocated tasks
        for(let day_index in this.state.allocated_tasks){
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            
            for(let task_index in day_tasks){
                if(day_tasks[task_index].task_id === task_id){
                    day_index_original = day_index
                    task_index_original = task_index

                    const new_state = update(this.state.allocated_tasks, {
                        [day_index_original] : {
                            tasks : {
                                $splice: [[task_index_original, 1]]
                            }
                        }
                    })

                    this.setState({
                        allocated_tasks : new_state
                    })
                    break;
                }
            }   

            if(task_index_original && day_index_original){
                break;
            }        
        }

        //Search through unallocated tasks if still not found
        if(!task_index_original && !task_index_original){
            for(let task of this.state.unallocated_tasks){
                if(task.task_id === task_id){
                    const new_state = update(this.state.unallocated_tasks, {
                        $splice : [[task_index_original, 1]]
                    })
                    this.setState({
                        unallocated_tasks : new_state
                    })
                }
            }
        }      



        Task.deleteTask(task_id, (err)=>{
            if(err){
                this.setState({
                    unallocated_tasks : original_unallocated_state,
                    allocated_tasks : original_allocated_state
                })
            }
            else{
                Toast.show({
                    text: `Task was deleted`,
                    buttonText: 'Ok'
                })
            }
        })
    }

    editTask = (task_id, new_title, new_details, cb=()=>{})=>{
        console.log("Editing Task");
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        let day_index_original = null
        let task_index_original = null
        
        //Search through allocated tasks
        for(let day_index in this.state.allocated_tasks){
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            
            for(let task_index in day_tasks){
                if(day_tasks[task_index].task_id === task_id){
                    day_index_original = day_index
                    task_index_original = task_index

                    const new_state = update(this.state.allocated_tasks, {
                        [day_index_original] : {
                            tasks : {
                                [task_index_original]: {
                                    title : {$set : new_title},
                                    details : {$set : new_details} 
                                }
                            }
                        }
                    })

                    this.setState({
                        allocated_tasks : new_state
                    })
                    break;
                }
            }   

            if(task_index_original && day_index_original){
                break;
            }        
        }

        //Search through unallocated tasks if still not found
        if(!task_index_original && !task_index_original){
            for(let task_index in this.state.unallocated_tasks){
                const task = this.state.unallocated_tasks[task_index]
                if(task.task_id === task_id){
                    const new_state = update(this.state.unallocated_tasks, {
                        [task_index] : {
                            title: {$set : new_title},
                            details : {$set : new_details}
                        }
                    })
                    this.setState({
                        unallocated_tasks : new_state
                    })
                }
            }
        }      

        Task.editTask(task_id, new_title, new_details, (err)=>{
            if(err){
                cb(err)
                this.setState({
                    unallocated_tasks : original_unallocated_state,
                    allocated_tasks : original_allocated_state
                })
            }
            else{
                Toast.show({
                    text: `Updated your task`,
                    buttonText: 'Ok'
                })
                cb()
            }
        })

    }

    _onDateSelection=(isodate)=>{
        this.setState({
            selected_date: isodate
        }, (err)=>{
            if(err)
                pass
            else{
                this.carousel.current.updateToDate(this.state.selected_date)
            }
        })
    }


   _generateEmptyTaskSet = ()=>{
       /*
        Generates an array of objects. Each object has the following form
        {
            date: String
            tasks : Array
        }
       */
        const day_variance = 28; //How many days of tasks you will show.
        const seconds_per_day = 86400;
        let task_set = [];

        const past_days_allowed = 14; //How far back in time do you want to see

        let starting_date_in_epoch = Math.floor(Date.now()/1000 - (seconds_per_day * past_days_allowed))

        for(let i = 0; i < day_variance; i++){

            //Convert from seconds back into miliseconds for date constructor
            const date = new Date((starting_date_in_epoch + (i * seconds_per_day)) * 1000) 
            task_set.push({
                date: date.toISOString().substring(0,10), //Only select the date part of ISO date
                tasks: []
            })
        }

        return task_set
    }

    _populateTaskSet = (tasks)=>{
        
        const unallocated_tasks = []
        const allocated_tasks = this._generateEmptyTaskSet()

        console.log("populating", tasks);
        for(let task_id in tasks){
            const task = tasks[task_id]
            if(task.allocated_date === null){
                unallocated_tasks.push(task)
            }
            else{
                for(let date_entry of allocated_tasks){
                    if(date_entry.date === task.allocated_date){
                        date_entry.tasks.push(task)
                        break;
                    }
                }
            }
        }

        this.setState({
            unallocated_tasks : unallocated_tasks,
            allocated_tasks : allocated_tasks,
            isLoading: false
        })
    }


    componentDidMount(){
        this._initalizeApp()
    }

    _initalizeApp = ()=>{
        AsyncStorage.getItem("espresso_app", (err, app)=>{
            const app_data = JSON.parse(app)
            if(!app_data){
                console.log("Initializing App for the first time");
                const intial_app_state = {
                    tasks: {}
                }

                AsyncStorage.setItem("espresso_app", JSON.stringify(intial_app_state), (err)=>{
                    if(err)
                        console.log("Error, initializing first time");
                    else{
                        this.setState({
                            allocated_tasks : this._generateEmptyTaskSet(),
                            isLoading: false
                        })
                    }
                })
            }
            else{
                console.log("APP DATA", app_data);
                const tasks = app_data.tasks
                this._populateTaskSet(tasks)
            }
        })
    }

    _promptTaskCreation = ()=>{
        this.setState({promptTaskCreation: true})
    }

    _openDrawer = ()=>{
        this.drawer.openDrawer()
    }

    _generateCalendarMarkers = ()=>{
        const markers_list = {}
        for(let day of this.state.allocated_tasks){
            if(!markers_list[day.date])
                markers_list[day.date] = {dots: []}

            for(task of day.tasks){
                if(task.completed)
                    markers_list[day.date]["dots"].push({key: task.task_id, color: "blue"})
                else
                    markers_list[day.date]["dots"].push({key: task.task_id, color: "red"})
            }
        }
        return markers_list
    }

    render(){
        return <UserTaskContext.Provider value={this.manager}>
        <TaskDrawer ref={(ref)=>{this.drawer = ref}} unallocated_tasks = {this.state.unallocated_tasks}>
            <Container style={{overflow:"hidden", height: Dimensions.get('window').height, flexDirection: "column"}}>
                <Header style={{backgroundColor: '#061328'}}>
                    <Body style={{justifyContent:"center"}}>
                        <Title style={{position:"absolute", left: 10, color:"#fff"}}>{`${getDay(this.today)} | ${this.today.toLocaleDateString()}`}</Title>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("settings")} style={{position:"absolute", right:10}}>
                            <Icon style={{color:"white"}} name="settings"/>
                        </TouchableOpacity>
                    </Body>
                </Header>

                <Content style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: "#fff"}} scrollEnabled = {false}>
                    <View style={{paddingBottom:50,height: Dimensions.get('window').height, width: Dimensions.get('window').width}}>
                  
                    

                        <Calendar
                            style={{paddingVertical: 5}}
                            markingType={'multi-dot'}
                            onDayPress={(day)=>{
                                this._onDateSelection(day.dateString)}}
                            markedDates={{
                                [this.state.selected_date]: {selected: true, selectedColor: 'red'},
                                ...this._generateCalendarMarkers()
                            }}/>
                        {/* <Button onPress={()=>{console.log(this.state)}}>
                            <Text>State </Text>
                        </Button> */}
                        <TaskCarousel
                            ref = {this.carousel}
                            isLoading = {this.state.isLoading}
                            selected_date = {this.state.selected_date}
                            handleDateSelection={this._onDateSelection} 
                            task_data={this.state.allocated_tasks} />



                    </View>
                </Content>

                <Footer style={{backgroundColor: "#222", width:Dimensions.get('window').width, height: 50, padding:0, margin: 0}} >
                    <FooterTab style={{padding:0,margin:0, flexDirection: "row", width:"100%", justifyContent:"center"}}>
                        

                        
                        <Button style={{justifyContent:"center", alignItems:"center", borderRadius:100}} onPress={this._openDrawer}>
                            <Icon style={{color:"white"}}  type="Entypo" name="blackboard"/>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        </TaskDrawer> 
        </UserTaskContext.Provider>
    }
}

export default HomeScreen