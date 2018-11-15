import React from 'react'
import {View, Text, Dimensions, TouchableHighlight} from 'react-native'
import Modal from 'react-native-modal'
import {Landable, Draggable, Embassy} from './../TravelingList'
import TaskList from '../TaskCarousel/TaskList'

export default class TaskDrawer extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }

        // Embassy.addOnStartHandler(this.closeDrawer)

    }

    closeDrawer = (coordinates,cb)=>{
        this.toggleDrawer(false, (err)=>{
            if(err)
                cb(err)
            else
                cb()
        })
    }

    toggleDrawer = (toggleState, cb)=>{
        const next_state = toggleState || !this.state.visible
        this.setState({
            visible: next_state
        }, cb)
    }

    _renderListItem = ({item,index})=>{
        return (
            <Draggable>
                <TaskCard title={item.title} details={item.details} isCompleted={item.completed}/>
            </Draggable>
        )  
    }


    render(){
        return (

            <Modal
                animationInTiming = {800}
                animationOutTiming = {800}
                animationIn = {"slideInLeft"}
                animationOut = {"slideOutLeft"}
                isVisible = {this.state.visible}
                onBackdropPress = {()=>this.toggleDrawer(false)}
                hideModalContentWhileAnimating = {true}
                style={{height:"80%", padding: 0, margin: 0}}>
                
                <View style={{top: 0, left: 0, padding: 0, margin:0, position: "absolute", backgroundColor: "orange", height: Dimensions.get('window').height, width: Dimensions.get('window').width*0.7 }}>
                    <View style={{alignItems: "center", justifyContent:"center", backgroundColor:"#222", height: "25%", width:"100%"}}>
                        <Text style={{fontSize:20, color:"white"}}> Unallocated Tasks </Text>
                    </View>
                    <View style={{padding:10, width:"100%", height:"100%"}}>
                    <TaskList
                        data = {this.props.task_data}
                    />
                    </View>
                </View>
            
            </Modal>
        )
    }
}