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
    constructor(props) {
        super(props)

        this.state = {
            data: [{title: "Test React", detail:"Make sure that it works"},
        {title: "Go to ReactNYC", detail:"Make sure you grab as much food as possbile"},
        {title: "Work on react native testing", detail:" yea"}]
        }
    }
    _renderTask = ({item,index})=>{
        return <TaskCard title={item.title} detail={item.detail} />
    }
    render(){
        return (
            <Carousel
                
                layout={'default'} 
                data={this.state.data}
                renderItem={this._renderTask}
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
            selected_date : ""
        }   

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
                  markedDates={{
                    '2018-09-16': {marked: true, selectedColor: 'blue'},
                    '2018-09-17': {marked: true},
                    '2018-09-18': {marked: true, dotColor: 'red', activeOpacity: 0},
                    '2018-09-19': {marked: true}
                    
                  }} />
                <TaskCarousel  />
                
               
            </Content>
        </Container>
    }
}

export default HomeScreen