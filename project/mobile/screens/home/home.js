//The home page for an account

import React from 'react'
import {View, InputGroup , Input, Textarea,Container, Content, Text, Button} from 'native-base'
import {AsyncStorage, TouchableHighlight} from 'react-native'
import Modal from 'react-native-modal'
import { Calendar } from 'react-native-calendars';
import TaskCarousel from './components/TaskCarousel'
import TaskDrawer from './components/TaskDrawer'

class TaskCreationForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            form_errors : [],
            task_title: "",
            task_detail: ""
        }
    }

    _submitForm = ()=>{
        AsyncStorage.getItem('session_token', (err, token)=>{
            if(err || !token)
                return this.props.navigation.navigate('landing')

            const task = {
                title: this.state.task_title,
                detail: this.state.task_detail
            }
            fetch('http://localhost:3000/create-task',{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            }).then((res)=>{
                console.log("status", res.status);
                if(res.ok){
                    this.props.onFormSubmission()
                }
                else if(res.status === 401){

                }
                else if(res.status === 400){
                    res.json().then(()=>{
                        this.setState({
                            form_errors : errors_txt
                        })
                    })
                }
            })
        })
    }

    render(){
        return <View style={{padding: 20 , backgroundColor: "white"}}>
            {this.state.form_errors.map((err)=>{
                return <View>
                        <Text> {err} </Text>
                    </View>
            })}
            <Text> Create Task</Text>
            <Textarea placeholder="Title" onChangeText={(txt)=>this.setState({task_title: txt})}/>
            <Textarea placeholder="Details" onChangeText={(txt)=>this.setState({task_detail: txt})}/>
            <Button onPress={this._submitForm}>
                <Text>Submit</Text>
            </Button>

           
            
        </View>
    }
}

class TaskCreationModalPrompt extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }
    }

    togglePrompt = ()=>{
        const next_state = !this.state.visible
        this.setState({
            visible: next_state
        })
    }

    render(){
        return <View>
            <Button onPress={this.togglePrompt}>
                <Text>Create Task</Text>
            </Button>

            <Modal
                onBackdropPress= {()=>this.togglePrompt()}
                isVisible={this.state.visible}>
                <View>
                    
                    <TaskCreationForm onFormSubmission={this.togglePrompt}/>

                </View>
            </Modal>
        </View>
    }
}


class HomeScreen extends React.Component{
    constructor(props) {
        super(props)
        this._isLoggedIn()

        this.state = {
            user : {
                username: ""
            },
            task_data : [],
            allocated_task_data : this._generateEmptyTaskSet(),
            selected_date: new Date().toISOString().substring(0,10),
            promptTaskCreation: false
        }   

        console.log("Current date is", this.state.selected_date);
        this.carousel = React.createRef()
        this.calendar = React.createRef()


     
    }

    static navigationOptions = {
        headerTitle: "Home",
        headerLeft: null,
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'papayawhip'
        },
        headerTitleStyle: {
            alignSelf: 'center'
        }
    };

    _onDateSelection=(isodate)=>{
        this.setState({
            selected_date: isodate
        }, (err)=>{
            if(err)
                console.log("updateCurrentSelectedDate", err);
            else{
                console.log("selected", this.state.selected_date);
                this.carousel.current.updateToDate(this.state.selected_date)
            }
        })

        
    }

   _generateEmptyTaskSet = ()=>{
        const day_variance = 30; //How many days of tasks you will show.
        const seconds_per_day = 86400;
        let task_set = [];

        const past_days_allowed = 15; //How far back in time do you want to see

        //Get starting date in seconds
        let starting_date_in_epoch = Math.floor(Date.now()/1000 - (seconds_per_day * past_days_allowed))

        //Generate an array of task data ranging from +/- day_variance from now
        for(let i = 0; i < day_variance; i++){
            //Convert from seconds back into miliseconds for date constructor
            const date = new Date((starting_date_in_epoch + (i * seconds_per_day)) * 1000) 
            task_set.push({
                title: "",
                detail: "",
                date: date.toISOString().substring(0,10)}) //Only select the date part of ISO date
        }
        console.log("Task set is", task_set);
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
                    console.log("STATUS IS", res.status);
                    if(res.ok){
                        res.json().then((tasks)=>{
                            console.log("TASKS ARE", tasks);
                            this.setState({
                                task_data: tasks
                            })
                        })
                    }
                }
            )
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

    

    render(){
        return <Container>
            <Content>
                <Calendar
                    onDayPress={(day)=>{
                        this._onDateSelection(day.dateString)}}
                    markedDates={{
                        [this.state.selected_date]: {selected: true, selectedColor: 'lightblue'},
                      }}/>

                <TaskCarousel
                    ref = {this.carousel}
                    selected_date = {this.state.selected_date}
                    handleDateSelection={this._onDateSelection} 
                    task_data={this.state.allocated_task_data} />

                <TaskCreationModalPrompt />
                <TaskDrawer task_data = {this.state.task_data}/>

                {/* <Button onPress={()=>console.log(this.state.task_data)}>
                    <Text> Test Tasks</Text>
                </Button> */}

                <Button onPress = {this._logout}> 
                    <Text> Logout</Text>
                </Button>

                <Button onPress= {()=>this.props.navigation.navigate("sandbox")}>
                      <Text> SandBox </Text>
                </Button>

            </Content>
        </Container>
    }
}

export default HomeScreen