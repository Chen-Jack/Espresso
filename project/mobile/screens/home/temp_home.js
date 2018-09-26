//The home page for an account

import React from 'react'
import {View, InputGroup , Textarea,Container, Content, Text, Button} from 'native-base'
import {AsyncStorage, TextInput} from 'react-native'
import { Calendar } from 'react-native-calendars';
import TaskCarousel from './components/TaskCarousel'

class HomeScreen extends React.Component{
    constructor(props) {
        super(props)
        this._isLoggedIn()

        this.state = {
            user : {
                username: ""
            },
            task_data : [],
            selected_date: new Date().toISOString()
        }   

        console.log("Current date is", this.state.selected_date);
        this.carousel = React.createRef()
        this.calendar = React.createRef()
     
    }

    static navigationOptions = {
        headerTitle: 'Login',
        headerLeft: null,
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#222'
        },
        headerTitleStyle: {
            alignSelf: 'center'
        }
    };

    _onDateSelection=(isodate)=>{
        console.log("UPDATING SELECTED DATE");
        this.setState({
            selected_date: isodate
        }, (err)=>{
            if(err)
                console.log("updateCurrentSelectedDate", err);
            else{
                console.log("Selected date is now", this.state.selected_date);
                this.carousel.current.updateToDate(this.state.selected_date)
            }
        })

        
    }

   _generateTaskData = ()=>{
        const day_variance = 20; //How many days of tasks you will show.
        const seconds_per_day = 86400;
        let task_set = [];

        //We generate tasks by going back by n/2 days, and then generate the following n days
        //so we have tasks for the +/- n/2 days.

        //Get starting date in seconds
        let starting_date_in_epoch = Math.floor(Date.now()/1000 - (seconds_per_day * day_variance/2))

        //Generate an array of task data ranging from +/- day_variance from now
        for(let i = 0; i < day_variance; i++){
            //Convert from seconds back into miliseconds for date constructor
            const date = new Date((starting_date_in_epoch + (i * seconds_per_day)) * 1000) 
            task_set.push(date.toISOString().substring(0,10)) //Only select the date part of ISO date
        }

        this.setState({
            task_data: task_set
        }, ()=>{
            console.log("TASK DATA", this.state.task_data);
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

        this._generateTaskData()
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
    

    render(){
        return <Container>
            <Content>
                <Calendar
                    onDayPress={(day)=>this._onDateSelection(day.dateString)}
                    markedDates={{
                        [this.state.selected_date]: {selected: true, selectedColor: 'lightblue'},
                      }}/>

                <TaskCarousel
                    ref = {this.carousel}
                    selected_date = {this.props.selected_date}
                    handleDateSelection={this._onDateSelection} 
                    task_data={this.state.task_data} />

                <Button onPress={()=>console.log(this.state.selected_date)}>
                    <Text>uh</Text>
                </Button>
               
            </Content>
        </Container>
    }
}

export default HomeScreen