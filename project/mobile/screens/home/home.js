//The home page for an account

import React from 'react'
import {Title, Header, Body,Footer, FooterTab, Container, Content, Text, Button, Toast, Thumbnail} from 'native-base'
import {AsyncStorage, View, Dimensions, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-calendars';
import {TaskCarousel} from './components/TaskCarousel'
import {TaskCreationPrompt} from './components/TaskForm'
import {TaskDrawer} from './components/TaskDrawer'
import {UserTaskProvider} from './UserTaskContext'
import update from 'immutability-helper'
import { Embassy } from './components/TravelingList';




class HomeScreen extends React.Component{
    constructor(props) {
        super(props)
        this._isLoggedIn()

        this.state = {
            user : {
                username: ""
            },
            unallocated_tasks : [],
            allocated_tasks : [],
            selected_date: new Date().toISOString().substring(0,10),
            promptTaskCreation: false
        }   

        this.carousel = React.createRef()
        this.calendar = React.createRef()


        this.manager = {
            updateStatus : this.updateCompletionStatusOfState,
            reallocateTask : this.reallocateTask,
            deallocateTask : this.deallocateTask,
            allocateTask : this.allocateTask,
            createTask : this.createTask,
            deleteTask : this.deleteTask
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
        console.log("Updating completion of task");

        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        let found = false;        
        //First Search Through Allocated Tasks
        for(let day_index in this.state.allocated_tasks){
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            for(let task_index in day_tasks){
                if(day_tasks[task_index].id === task_id){
                    const new_state = update(this.state.allocated_tasks, {[day_index]: {tasks: {[task_index] : {completed: {$set : new_status}}}}});
                    found = true;

                    original_state = this.state.allocated_tasks
                    this.setState({
                        allocated_tasks : new_state
                    })
                }
            }
        }
    

        //Search through unallocated tasks if still haven't found
        if(!found){
            for(let i in this.state.unallocated_tasks){
                if(this.state.unallocated_tasks[i].id === task_id){
                    new_state = update(this.state.unallocated_tasks, {[i] : {isCompleted: {$set, new_status}}})
                    
                    original_state = this.state.unallocated_tasks
                    this.setState({
                        unallocated_tasks : new_state
                    })
                }
            }
        }
            
        this._updateTaskStatusServerSide( (err)=>{
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
            
            if(task.id === task_id){
                Object.assign(original_task , task)
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

        this._updateTaskDateServerSide(task_id, new_date, (err)=>{
            if(err){
                this.setState({
                    unallocated_tasks : original_unallocated_state,
                    allocated_tasks : original_allocated_state
                })
            }
        })
    }

    deallocateTask = (task_id, cb=()=>{}) => {
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
                    Object.assign(original_task ,day_tasks[task_index])
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

        this._updateTaskDateServerSide(task_id, null, (err)=>{
            if(err){
                this.setState({
                    allocated_tasks : original_allocated_state,
                    unallocated_tasks : original_unallocated_state
                }, ()=>{
                    console.log("Error with updating task date", err);
                    alert("Error with api call")
                })
            }
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
                if(day_tasks[task_index].id === task_id){
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
    

        //Now Start The Actual API call
        this._updateTaskDateServerSide(task_id, new_date, (err)=>{
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

    createTask = (task_id, creator_id, creation_time, title, details, cb=()=>{})=>{
        // const original_state = this.unallocated_tasks

        // const new_task = {
        //     allocated_date : null,
        //     completed: false,
        //     created_at : creation_time,
        //     creator_id : creator_id,
        //     details : details,
        //     id: task_id,
        //     title : title,
        // }
        // const new_state = update(this.state.unallocated_tasks, {
        //     $unshift : [new_task]
        // })

        // this.setState({
        //     unallocated_tasks : new_state
        // })

        // this._createTaskServerSide(title, details, (err)=>{
        //     if(err){
        //         this.setState({
        //             unallocated_tasks: original_state
        //         })
        //     }
        // })
    }

    deleteTask = (task_id, cb=()=>{})=>{

    }

    _createTaskServerSide = (title, details, cb = ()=>{})=>{
        AsyncStorage.getItem("session_token", (err, session_token)=>{
            const data = {
                task_title: title,
                task_details: details
            }
            fetch("http://localhost:3000/create-task", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${session_token}`,
                    "Content-Type": "application/json; charset=utf-8",
                },
                body : JSON.stringify(data)
            }).then(
                (res)=>{
                    if(res.ok){
                        
                        cb()
                    }

                    else{
                        cb("Res not ok")
                    }
                }
            ).catch((err)=>{
                console.log("Error when creating task", err)
                cb(err)
                alert("Error")
            })
        })
    }

    _updateTaskStatusServerSide = (task_id, new_status, cb=()=>{})=>{
        AsyncStorage.getItem("session_token", (err, session_token)=>{
            const data = {
                task_id: task_id,
                completion_status: new_status
            }
            fetch("http://localhost:3000/toggle-task-completion", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${session_token}`,
                    "Content-Type": "application/json; charset=utf-8",
                },
                body : JSON.stringify(data)
            }).then(
                (res)=>{
                    if(res.ok){
                        
                        cb()
                    }

                    else{
                        cb("Res not ok")
                    }
                }
            ).catch((err)=>{
                console.log("Error when toggling tasks", err)
                cb(err)
                alert("Error")
            })
        })
    }

    _updateTaskDateServerSide = (task_id, new_date, cb=()=>{})=>{
        AsyncStorage.getItem("session_token", (err, session_token)=>{
            if(err)
                return console.log("ERROR WHEN RETRIEVING SESSION TOKEN")
                
            const data = {
                task_id: task_id,
                new_date: new_date
            }
            fetch("http://localhost:3000/allocate-task", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${session_token}`,
                    "Content-Type": "application/json; charset=utf-8",
                },
                body : JSON.stringify(data)
            }).then(
                (res)=>{
                    if(res.ok){
                
                        cb()
                    }

                    else{
                        cb("Res not ok")
                    }
                }
            ).catch((err)=>{
                cb(err)
            })
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
        const day_variance = 14; //How many days of tasks you will show.
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

    _populateTaskSet = ()=>{
        AsyncStorage.getItem("session_token", (err, session_token)=>{
            fetch("http://localhost:3000/retrieve-tasks-by-user", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session_token}`
                }
            }).then(
                (res)=>{
                    if(res.ok){
                        res.json().then((tasks)=>{
                            const unallocated_tasks = []

                            // Generate a new object copy. React will not
                            // properly call updates on objects due to references.
                            const allocated_tasks = this._generateEmptyTaskSet()

                            for(let task of tasks){
                                let wasTaskAllocated = false;
                                for(let date_entry of allocated_tasks){
                                    if(date_entry.date === task.allocated_date){
                                        date_entry.tasks.push(task)
                                        wasTaskAllocated = true
                                        break;
                                    }
                                }

                                if(!wasTaskAllocated){
                                    unallocated_tasks.push(task)
                                }
                            }
                            this.setState({
                                unallocated_tasks: unallocated_tasks,
                                allocated_tasks: allocated_tasks
                            })
                        })
                    }
                }
            ).catch((err)=>{
                console.log("Error when populatingTaskSet", err)
                alert("Error")
            })
        })
    }


    componentDidMount(){
        AsyncStorage.getItem("session_token", (err, session_token)=>{
            fetch("http://localhost:3000/get-user-data", {
                headers: {
                    Authorization: `Bearer ${session_token}`
                }
            }).then(
                (res)=>{
                    if(res.ok){
                        res.json().then((user_data)=>{
                            this.setState({
                                user: user_data
                            })
                        })
                    }
                }
            )
        })

        this._populateTaskSet()

    }

    _logout = ()=>{
        AsyncStorage.removeItem("session_token", (err)=>{
            this.props.navigation.navigate('landing')
        })
    }

    _isLoggedIn = ()=>{
        AsyncStorage.getItem("session_token", (err , session_token)=>{
            if(err || !session_token){
                this.props.navigation.navigate('landing')
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
                    markers_list[day.date]["dots"].push({key: task.id, color: "blue"})
                else
                    markers_list[day.date]["dots"].push({key: task.id, color: "red"})
            }
        }
        return markers_list
    }

    render(){
        const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
        return <TaskDrawer ref={(ref)=>{this.drawer = ref}} unallocated_tasks = {this.state.unallocated_tasks}>
            <Container style={{overflow:"hidden", height: Dimensions.get('window').height, flexDirection: "column"}}>
                <Header style={{backgroundColor: '#061328'}}>
                    <Body>
                        <Title style={{color:"#fff"}}>Header</Title>
                    </Body>
                </Header>

                <Content style={{backgroundColor: "#fff"}} scrollEnabled = {false}>
                    <View style={{height: Dimensions.get('window').height, width: Dimensions.get('window').width}}>
                  
                    <UserTaskProvider value={this.manager}>

                        <Calendar
                            style={{paddingVertical: 5}}
                            markingType={'multi-dot'}
                            onDayPress={(day)=>{
                                this._onDateSelection(day.dateString)}}
                            markedDates={{
                                // [this.state.selected_date]: {selected: true, selectedColor: 'red'},
                                ...this._generateCalendarMarkers()
                            }}/>

                        <TaskCarousel
                            ref = {this.carousel}
                            selected_date = {this.state.selected_date}
                            handleDateSelection={this._onDateSelection} 
                            task_data={this.state.allocated_tasks} />

                    </UserTaskProvider>

                    </View>
                </Content>

                <Footer style={{backgroundColor: "#222", width:Dimensions.get('window').width, height: 50, padding:0, margin: 0}} >
                    <FooterTab style={{padding:0,margin:0, flexDirection: "row", width:"100%", justifyContent:"center"}}>
                        
                        {/* <TaskCreationPrompt /> */}

                        {/* <Button onPress = {this._logout}> 
                            <Text style={{color:"white"}}> Logout</Text>
                        </Button> */}
                       
                        
                        <TouchableOpacity onPress={this._openDrawer}>
                            <Thumbnail small source={{uri: uri}} />
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>
            </Container>
        </TaskDrawer> 
    }
}

export default HomeScreen