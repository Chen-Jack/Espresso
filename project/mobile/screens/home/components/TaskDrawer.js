import React from 'react'
import {View, FlatList, Text, Header, Animated, Dimensions, TouchableHighlight} from 'react-native'
import {Badge, Item} from 'native-base'
import Modal from 'react-native-modal'

import {Button,List} from 'native-base'

const TaskList = ({task_data = []})=>{
    console.log("TASK PLS", task_data);
    return (
        <FlatList
            data = {task_data}
            renderItem = {({item: task, index})=>{
                console.log("TASK/", task);
                return  <Text>Date : {task.date}</Text>
            }}/> 
    )
}

export default class TaskDrawer extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }

        console.log('waot', this.props.task_data);
    }

    toggleDrawer = ()=>{
        const next_state = !this.state.visible
        this.setState({
            visible: next_state
        })
    }


    render(){
        return (
        <View>  
            {/* The component responsible for calling the drawer */}
            <TouchableHighlight
                onPress={this.toggleDrawer}>     
                <Badge info>
                    {/* style={{position: "absolute", top: 0}}  */}
                    <Text>
                        S
                    </Text>
                </Badge>
            </TouchableHighlight> 

            <Modal
                animationInTiming = {800}
                animationOutTiming = {800}
                animationIn = {"slideInUp"}
                animationOut = {"slideOutDown"}
                swipeDirection = {"down"}
                onSwipe = {()=>this.toggleDrawer()}
                isVisible = {this.state.visible}
                onBackdropPress = {()=>this.toggleDrawer()}
                hideModalContentWhileAnimating = {true}
                style={{padding: 0, margin: 0}}>
                
                <View style={{padding:0, margin:0, position: "absolute", bottom: 0, left:0, backgroundColor: "#efefef", width: Dimensions.get('window').width, height:Dimensions.get('window').height*0.75}}>
                  <Text> Tasks </Text>
                  <TaskList task_data={this.props.task_data}/>
                </View>
            
            </Modal>

        </View>

    )}
}