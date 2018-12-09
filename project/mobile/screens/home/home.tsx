//The home page for an account

import React from 'react'
import {Title, Header, Body,Footer, FooterTab, Container, Content, Button, Toast, Icon} from 'native-base'
import {AsyncStorage, View, Dimensions, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-calendars';
import {TaskCarousel} from './components/TaskCarousel'
import {TaskCreationPrompt} from './components/TaskForm'
import {TaskDrawer} from './components/TaskDrawer'
import {UserTaskContext, EditModeContext} from './Context'
import update from 'immutability-helper'
import { Embassy } from './components/TravelingList';
import TaskStorage, {Taskable, TaskSet} from './../../Task'
import {getDay} from './../../utility'

export interface ManagerContext{
    updateStatus : any,
    reallocateTask: any,
    deallocateTask: any,
    allocateTask: any,
    createTask: any,
    deleteTask: any,
    editTask : any,
    deallocateTasksFromDate: any
}

export interface EditContext{
    isEditMode : boolean,
    toggleEditMode : ()=>void
}


interface HomeScreenState{
    user : any,

    selected_date: string,

    unallocated_tasks : Taskable[],
    allocated_tasks: TaskSet[]
    promptTaskCreation : boolean,
    isEditMode: boolean
    isLoading: boolean,

}

class HomeScreen extends React.Component<any,HomeScreenState>{
    static navigationOptions = {
        header: null,
        gesturesEnabled: false, // Prevent swipe back
    };


    today: Date
    editContext: EditContext
    manager: ManagerContext
    carousel: React.RefObject<TaskCarousel>
    calendar: React.RefObject<Calendar>
    drawer: TaskDrawer | null
    

    constructor(props : any) {
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
            isEditMode: false
        }   

        this.carousel = React.createRef()
        this.calendar = React.createRef()
        this.drawer = null

        this.today = new Date()

        this.editContext = {
            isEditMode : this.state.isEditMode,
            toggleEditMode : this.toggleEditMode
        }

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

 
    toggleEditMode = ()=>{
        this.setState({
            isEditMode : !this.state.isEditMode
        }, ()=>{
            console.log("TOGGLED THE CONTEXT EDITMODE TO", this.state.isEditMode);
            if(this.state.isEditMode){
                this.carousel.current.disableCarouselScroll()
            }
            else{
                this.carousel.current.enableCarouselScroll()
            }
        })
    }

    updateCompletionStatusOfState = (task_id:string, new_status:boolean, cb:(err?:any)=>{})=>{
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks
  
        // First Search Through Allocated Tasks
        let found = false;      
        for(let day_index in this.state.allocated_tasks){
            const day_tasks = this.state.allocated_tasks[day_index].tasks
            for(let task_index in day_tasks){
                if(day_tasks[task_index].task_id === task_id){
                    const new_state = update(this.state.allocated_tasks, {
                        [day_index]: {
                            tasks: {
                                [task_index] : {
                                    completed: {$set : new_status}
                                }
                            }
                        }
                    });
                    found = true;

                    this.setState({
                        allocated_tasks : new_state
                    }, ()=>console.log("allocated state was set to", this.state.allocated_tasks))
                }
            }
        }
    

        // Search through unallocated tasks if still haven't found
        if(!found){
            for(let i in this.state.unallocated_tasks){
                if(this.state.unallocated_tasks[i].task_id === task_id){
                    const new_state = update(this.state.unallocated_tasks, {
                        [i] : {
                            completed: {
                                $set : new_status
                            }
                        }
                    })
                    
                    this.setState({
                        unallocated_tasks : new_state
                    })
                }
            }
        }
            
        TaskStorage.updateStatus(task_id, new_status, (err)=>{
            if(err){
                this.setState({
                    allocated_tasks : original_allocated_state,
                    unallocated_tasks : original_unallocated_state
                })
                cb(err)
            }
            else{
                cb()
            }
        })

    }

    allocateTask = (task_id : string, new_date:string, cb=()=>{})=>{
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        let original_task : Taskable = {
            task_id : "", 
            title : "",
            details : null,
            completed: false,
            allocated_date : null
        };
        let day_index_updated : number = -1;
        let task_index_original : number = -1;

        // Search through your state to know what indexes to update
        for(let task_index in this.state.unallocated_tasks){
            let task = this.state.unallocated_tasks[task_index]
            
            if(task.task_id === task_id){
                original_task = Object.assign({} , task)
                original_task.allocated_date = new_date
                task_index_original = Number(task_index)
            }
            
        }
        
        for(let day_index in this.state.allocated_tasks){
            let date = this.state.allocated_tasks[day_index].date
            if(date == new_date){
                day_index_updated = Number(day_index)
                break
            }
        }

        
        const new_unallocated_state = update(this.state.unallocated_tasks, {
            $splice: [[task_index_original, 1]]
        })

        const new_allocated_state = update(this.state.allocated_tasks, {
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

        TaskStorage.allocateTask(task_id, new_date, (err)=>{
            if(err){
                this.setState({
                    unallocated_tasks : original_unallocated_state,
                    allocated_tasks : original_allocated_state
                })
            }
        })
       
    }

    deallocateTasksFromDate = (target_date : string, cb=()=>{})=>{
        console.log("deallocating all tasks on date", target_date);
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        const original_task_array : Taskable[] = []
        let original_date_index : number = -1;

        // Search through your state to know what indexes to update
        for(let day_index in this.state.allocated_tasks){
            let date : string = this.state.allocated_tasks[day_index].date
            let day_tasks : Taskable[] = this.state.allocated_tasks[day_index].tasks
            if(date === target_date){
                original_date_index = Number(day_index)
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

        
        const task_id_arr : string[] = original_task_array.map(task=>task.task_id)

        TaskStorage.allocateMultipleTasks(task_id_arr, null, (err)=>{
            if(err){
                console.log("ERROR DEALLOCATING EVERYTHING");
                this.setState({
                    allocated_tasks: original_allocated_state,
                    unallocated_tasks: original_unallocated_state
                })
            }
        })
        
    }

    deallocateTask = (task_id : string, cb=()=>{}) => {
        console.log("deallocating");
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        var original_task : Taskable;
        let day_index_original : number = -1;
        let task_index_original : number = -1;

        //Search through your state to know what indexes to update
        for(let day_index in this.state.allocated_tasks){
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            
            for(let task_index in day_tasks){
                if(day_tasks[task_index].task_id === task_id){
                    var original_task = Object.assign({} , day_tasks[task_index])
                    day_index_original = Number(day_index)
                    task_index_original = Number(task_index)
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

        TaskStorage.allocateTask(task_id, null)
    }

    reallocateTask = (task_id : string, new_date:string, cb=()=>{})=>{
        /*
        Uses an optomistic UX approach. Update the UI before API actually
        finishes.
        */
        
        // Keep original_state incase of failed API call
        const original_state = this.state.allocated_tasks

        let original_task : Taskable
        let day_index_original : number
        let task_index_original : number
        let day_index_updated : number
        
        // Gather variables to know what to mutate
        for(let day_index in this.state.allocated_tasks){
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            const  date = this.state.allocated_tasks[day_index].date

            if(date === new_date){
                day_index_updated = Number(day_index)
            }
            
            for(let task_index in day_tasks){
                if(day_tasks[task_index].task_id === task_id){
                    original_task = Object.assign({} , day_tasks[task_index])
                    day_index_original = Number(day_index)
                    task_index_original = Number(task_index)
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
    

        TaskStorage.allocateTask(task_id, new_date, (err)=>{
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

    createTask = (title : string, details : string | null, cb=()=>{})=>{
         // Keep original_state incase of failed API call
        const original_state = this.state.unallocated_tasks

        TaskStorage.createTask(title, details, (err : any, new_task : Taskable)=>{
            if(err){
                this.setState({
                    unallocated_tasks : original_state,
                },cb)
            }
            else{
                const new_state = update(this.state.unallocated_tasks, {
                    $unshift : [new_task]
                })
                this.setState({
                    unallocated_tasks : new_state
                }, cb)
            }
        })

    }

    deleteTask = (task_id : string, cb=()=>{})=>{
        console.log("DELETING", task_id);
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        let day_index_original :number = -1
        let task_index_original : number = -1
        
        // Search through allocated tasks
        for(let day_index in this.state.allocated_tasks){
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            
            for(let task_index in day_tasks){
                if(day_tasks[task_index].task_id === task_id){
                    day_index_original = Number(day_index)
                    task_index_original = Number(task_index)

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



        TaskStorage.deleteTask(task_id, (err)=>{
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

    editTask = (task_id : string, new_title : string, new_details : string | null, cb=()=>{})=>{
        console.log("Editing Task");
        const original_allocated_state = this.state.allocated_tasks
        const original_unallocated_state = this.state.unallocated_tasks

        let day_index_original : number = -1
        let task_index_original : number = -1
        
        //Search through allocated tasks
        for(let day_index in this.state.allocated_tasks){
            let day_tasks = this.state.allocated_tasks[day_index].tasks
            
            for(let task_index in day_tasks){
                if(day_tasks[task_index].task_id === task_id){
                    day_index_original = Number(day_index)
                    task_index_original = Number(task_index)

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

        TaskStorage.editTask(task_id, new_title, new_details, (err : any)=>{
            if(err){
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
            }
        })

    }

    _onDateSelection= (isodate : string)=>{
        this.setState({
            selected_date: isodate
        }, ()=> {
            this.carousel.current.updateToDate(this.state.selected_date)
        })
    }


   _generateEmptyTaskSet  = () : Array<TaskSet> =>{
        const day_variance = 28; //How many days of tasks you will show.
        const seconds_per_day = 86400;
        const task_set = [];

        const past_days_allowed = 14; //How far back in time do you want to see

        let starting_date_in_epoch = Math.floor(Date.now()/1000 - (seconds_per_day * past_days_allowed))

        for(let i = 0; i < day_variance; i++){

            //Convert from seconds back into miliseconds for date constructor
            const date = new Date((starting_date_in_epoch + (i * seconds_per_day)) * 1000) 
            task_set.push({
                date : date.toISOString().substring(0,10), //Only select the date part of ISO date
                tasks: []
            })
        }

        return (task_set)
    }

    _populateTaskSet = (tasks : Taskable[])=>{
        
        const unallocated_tasks : Taskable[] = []
        const allocated_tasks : Array<TaskSet> = this._generateEmptyTaskSet()

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
            const app_data = JSON.parse(app as string)
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

            for(let task of day.tasks){
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
            <EditModeContext.Provider value={this.editContext}>
                <TaskDrawer ref={(ref)=>{this.drawer = ref as TaskDrawer}} unallocated_tasks = {this.state.unallocated_tasks}>
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
                                    hideExtraDays={true}
                                    style={{paddingVertical: 5}}
                                    markingType={'multi-dot'}
                                    onDayPress={(day)=>{
                                        this._onDateSelection(day.dateString)}}
                                    markedDates={{
                                        [this.state.selected_date]: {selected: true, selectedColor: 'red'},
                                        ...this._generateCalendarMarkers()
                                    }}
                                    />
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
            </EditModeContext.Provider>
        </UserTaskContext.Provider>
    }
}

export default HomeScreen