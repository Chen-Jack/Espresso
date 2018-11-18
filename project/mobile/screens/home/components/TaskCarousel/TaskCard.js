import React from 'react'
import {Card, CardItem, Text, Body} from 'native-base'
import {Draggable} from './../TravelingList'
import PropTypes from 'prop-types'
import {AsyncStorage} from 'react-native'

export default class TaskCard extends React.Component{
    constructor(props) {
        super(props)

    }
    
    _handleDoubleTap = ()=>{
        console.log("Double Tap");

        AsyncStorage.getItem("session_token", (err, session_token)=>{
            const data = {
                task_id: this.props.task_id,
                completion_status: !this.props.isCompleted
            }
            console.log("Data submitting is", data);
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
                        console.log("Updated task");
                    }
                    else{
                        console.log("handledoubletap res not ok");
                    }
                }
            ).catch((err)=>{
                console.log("Error when toggling tasks", err)
                alert("Error")
            })
        })
    }
  
    render(){
        let strike_through_style = {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}
        return (
            <Draggable doubleTapHandler = {this._handleDoubleTap}>
                <Card>
                    <CardItem bordered>
                        <Text style={this.props.isCompleted ? strike_through_style : {} }>{this.props.title || "Title"}</Text>
                    </CardItem>

                    <CardItem>
                        <Body>
                            <Text>
                                {this.props.details || ""}
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
        </Draggable> )
    }
}

TaskCard.propTypes = {
    task_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    details : PropTypes.string,
    isCompleted: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf([0,1]),
      ]).isRequired,
    
}