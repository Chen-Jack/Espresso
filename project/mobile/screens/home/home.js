//The home page for an account

import React from 'react'
import {Footer, FooterTab, Container, Content, Text, Button} from 'native-base'
import {Dimensions, AsyncStorage } from 'react-native'
import { Calendar } from 'react-native-calendars';
import {TaskCarousel} from './components/TaskCarousel'
import {TaskCreationPrompt} from './components/TaskForm'
import {TaskDrawer} from './components/TaskDrawer'
import {UserTaskProvider} from './UserTaskContext'
import update from 'immutability-helper'


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
        this.drawer = React.createRef()


        this.task_management_context = {
            add: this.addTaskToState,
            remove: this.removeTaskFromState,
            updateStatus: this.updateCompletionStatusOfState,
            setDate : this.allocateTaskToDate
        }
     
    }

    static navigationOptions = {
        headerTitle: "Home",
        headerLeft: null,
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#222'
        },
        headerTitleStyle: {
            alignSelf: 'center'
        },
        gesturesEnabled: false, // Prevent swipe back
    };

    addTaskToState = ()=>{

    }

    removeTaskFromState = ()=>{

    }

    updateCompletionStatusOfState = (task_id, new_status, cb=()=>{})=>{
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
                        console.log("Updating completion of task");
                        let found = false;
       
                        
                        //First Search Through Allocated Tasks
                        for(let day_index in this.state.allocated_tasks){
                            let day_tasks = this.state.allocated_tasks[day_index].tasks
                            for(let task_index in day_tasks){
                                if(day_tasks[task_index].id === task_id){
                                    const new_state = update(this.state.allocated_tasks, {[day_index]: {tasks: {[task_index] : {completed: {$set : new_status}}}}});
                                    found = true;
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
                                    console.log("found unallocated");
                                    this.setState({
                                        unallocated_tasks : new_state
                                    })
                                }
                            }
                        }

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

    allocateTaskToDate = ()=>{

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
        const day_variance = 7; //How many days of tasks you will show.
        const seconds_per_day = 86400;
        let task_set = [];

        const past_days_allowed = 4; //How far back in time do you want to see

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
        this.drawer.current.toggleDrawer(true)
    }

    _generateCalendarMarkers = ()=>{
        const markers_list = {}
        for(let day of this.state.allocated_tasks){
            if(!markers_list[day.date])
                markers_list[day.date] = {dots: []}

            for(task of day.tasks){
                markers_list[day.date]["dots"].push({key: task.id, color: "blue"})
            }
        }
        console.log("returning", markers_list);
        return markers_list
    }

    render(){
        return <Container >
            <Content style={{backgroundColor: "#333"}} scrollEnabled = {false}>
                <Button onPress={()=>console.log(this.state)}>
                    <Text> State </Text>
                </Button>
                <UserTaskProvider value={this.task_management_context}>

                    <TaskDrawer ref={this.drawer} task_data = {this.state.unallocated_tasks}/>

                    <Calendar
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
        
            </Content>

            <Footer style={{backgroundColor: "#222", padding:0, margin: 0}} >
                <FooterTab>
                    <TaskCreationPrompt />

                    <Button onPress = {this._logout}> 
                        <Text style={{color:"white"}}> Logout</Text>
                    </Button>
                    
                    <Button onPress= {()=>this.props.navigation.navigate("sandbox")}>
                        <Text style={{color: "white"}}> SandBox </Text>
                    </Button>
                    <Button onPress={this._openDrawer}>
                        <Text> Toggle Drawer</Text>
                    </Button>
                    
                </FooterTab>
            </Footer>
        </Container>
    }
}

export default HomeScreen