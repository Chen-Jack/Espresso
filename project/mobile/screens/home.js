//The home page for an account

import React from 'react'
import {Container, Content, Text, Button} from 'native-base'
import {AsyncStorage} from 'react-native'

class HomeScreen extends React.Component{
    constructor(props) {
        super(props)
        this._isLoggedIn()

        this.state = {
            user : {
                username: ""
            }
        }   
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
                <Button onPress = {this._logout}> 
                    <Text> Logout</Text>
                </Button>
                <Text> Home Page of {this.state.user.username}</Text>
                <Button onPress={()=>{
                    AsyncStorage.getItem('session_token', (err, token)=>{
                        fetch('http://localhost:3000/create-task',{
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({title: "idk"})
                        }).then((res)=>{
                            console.log(res.status);
                        })
                    })
                }}>
                    <Text> Test </Text>
                </Button>
            </Content>
        </Container>
    }
}

export default HomeScreen