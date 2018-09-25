//The home page for an account

import React from 'react'
import {View, InputGroup , Textarea,Container, Content, Text, Button, Card, CardItem, Body} from 'native-base'
import {AsyncStorage, TextInput, Dimensions} from 'react-native'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Carousel from 'react-native-snap-carousel'

class TaskCard extends React.Component{
    //Every task includes a title (required), detail (optional), and date (optional)
    constructor(props) {
        super(props)
    }

    render(){
        return (<Card>
            <CardItem header bordered>
              <Text>{this.props.title}</Text>
            </CardItem>

            <CardItem>
             <Body>
               <Text>
                    {this.props.detail}
               </Text>
             </Body>
           </CardItem>
       </Card>)
    }
}

class TaskCarousel extends React.Component{

    _renderTaskCard = ({item,index})=>{
        return <TaskCard title={item} detail={"TEST"} />
    }

    _handleCardSelection = (data_index)=>{
        console.log("PROPS DATA is", this.props.task_data);
        console.log("DATA INDEX IS", data_index)
        const iso_date = this.props.task_data[data_index];
        console.log("ISO DATE IS", iso_date);
        this.props.handleDateSelection(iso_date)
    }

    
    render(){
        return (
            <Carousel
                onSnapToItem = {this._handleCardSelection}
                layout={'default'} 
                data={this.props.task_data}
                renderItem={this._renderTaskCard}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width/2}
            />
        )
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
            selected_date: new Date().toISOString().substring(0,10)
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

    updateCurrentSelectedDate=(isodate)=>{
        console.log("UPDATING SELECTED DATE");
        this.setState({
            selected_date: isodate
        }, (err)=>{
            if(err)
                console.log("updateCurrentSelectedDate", err);
            else
                console.log("Selected date is now", this.state.selected_date);
        })
    }


   _generateTaskData = ()=>{
        const day_variance = 20;
        const seconds_per_year = 31540000;
        const seconds_per_day = 86400;
        let task_set = [];

        //We generate tasks by going back by n/2 days, and then generate the following n days
        //so we have tasks for the past/next n/2 days.

        //Get starting time in seconds
        let starting_epoch_time = Math.floor(Date.now()/1000 - (seconds_per_day * day_variance/2))

        //Generate an array of task data ranging from +/- day_variance from now
        for(let i = 0; i < day_variance; i++){
            //Convert from seconds back into miliseconds for constructor
            const date = new Date((starting_epoch_time + (i * seconds_per_day))*1000) 
            task_set.push(date.toISOString().substring(0,10))
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
                <Calendar current = {this.state.selected_date}/>

                <TaskCarousel 
                    handleDateSelection={this.updateCurrentSelectedDate} 
                    task_data={this.state.task_data} />

                <Button>
                    <Text> ? </Text>
                </Button>
               
            </Content>
        </Container>
    }
}

export default HomeScreen