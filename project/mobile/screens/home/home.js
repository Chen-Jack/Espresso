//The home page for an account

import React from 'react'
import {Footer, FooterTab, Container, Content, Text, Button} from 'native-base'
import {Dimensions, AsyncStorage } from 'react-native'
import { Calendar } from 'react-native-calendars';
import {TaskCarousel} from './components/TaskCarousel'
import {TaskCreationPrompt} from './components/TaskForm'
import {TaskDrawer} from './components/TaskDrawer'


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

    _onDateSelection=(isodate)=>{
        console.log("Date Selection");
        this.setState({
            selected_date: isodate
        }, (err)=>{
            if(err)
                pass
                // console.log("updateCurrentSelectedDate", err);
            else{
                // console.log("selected", this.state.selected_date);
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

        const past_days_allowed = Math.floor(day_variance*0.5); //How far back in time do you want to see

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
                    // console.log("STATUS IS", res.status);
                    if(res.ok){
                        res.json().then((tasks)=>{
                            // console.log("TASKS ARE", tasks);
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

    render(){
        return <Container >
            <Content style={{backgroundColor: "#333"}} scrollEnabled = {false}>

                <TaskDrawer ref={this.drawer} task_data = {this.state.unallocated_tasks}/>

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
                    task_data={this.state.allocated_tasks} />

    
        
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