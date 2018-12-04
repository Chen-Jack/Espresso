import React from 'react'
import {Card, CardItem, Text, Body,Button, View, Badge, Icon,Input} from 'native-base'
import {TouchableOpacity, Alert, TextInput} from 'react-native'
import {Draggable} from './../TravelingList'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import {UserTaskContext, EditModeContext} from '../../Context'
import Collapsible from 'react-native-collapsible';
import {TaskEditForm} from './../TaskForm'

class EditTaskButton extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            isEditing : false
        }
    }

    togglePrompt = ()=>{
        this.setState({
            isEditing: !this.state.isEditing
        })
    }
    render(){
        return <View>
            <TouchableOpacity onPress={this.togglePrompt}>
                <Icon style={{fontSize:20, marginHorizontal: 5}} type={"FontAwesome"} name="pencil"/>
            </TouchableOpacity>

            <Modal onBackdropPress={this.togglePrompt} style={{justifyContent:"center", alignItems:"center"}} isVisible={this.state.isEditing}>
                <TaskEditForm task_id={this.props.task.task_id} title={this.props.task.title} details={this.props.task.details} onFormFinishedSubmition={this.togglePrompt}/>
            </Modal>
        </View>
    }
}

class DeleteButton extends React.Component{
    constructor(props) {
        super(props)
    }

    triggleDeletePrompt = (deleteTaskHandler)=>{
        Alert.alert('Delete Card', "Are you sure?", 
        [
            {text: "Cancel", onPress:()=>{}, style:"cancel"},
            {text:"Delete", onPress:()=>{deleteTaskHandler(this.props.task_id)}}
        ])
    }

    render(){
        return <UserTaskContext.Consumer>
            { ({deleteTask})=> <View>
                <TouchableOpacity onPress={this.triggleDeletePrompt.bind(this,deleteTask)}>
                    <Icon style={{fontSize:20, marginHorizontal: 5}} name="trash"/>
                </TouchableOpacity>
                </View>
            }
        </UserTaskContext.Consumer>
    }
}


class Options extends React.Component{
    render(){
        return <View style={{flexDirection:"row"}}>
            <EditTaskButton task={this.props.task}/>
            <DeleteButton task_id = {this.props.task.task_id}/>
        </View>
    }
}

const CardOptions = ({task, details, isEditMode, isCollapsed, toggleDetails})=>{
    
    if(isEditMode){
        return <View style={{flexDirection:"row",alignItems:"center"}}>
            <Options task={task}/>
        </View>
    }
    else if(details){
        return <TouchableOpacity onPress={toggleDetails}>
            {isCollapsed ? <Icon type="Entypo" name="chevron-small-down"/> : <Icon type="Entypo" name="chevron-small-up"/>}  
        </TouchableOpacity>
    }
    else{
        return null
    }
}

export default class TaskCard extends React.Component{
    constructor(props) {
        super(props)

        this.state={
            isCollapsed : true
        }
    }
    toggleCard = ()=>{
        this.setState({
            isCollapsed: !this.state.isCollapsed
        })
    }
    componentDidMount(){
        console.log("Card Mounting", this.props.task_id, this.props);
    }
    componentWillUnmount(){
        console.log("TaskCard Unmounting");
    }
    render(){
        const task = {
            task_id : this.props.task_id,
            title : this.props.title,
            details: this.props.details
        }
        
        let strike_through_style = {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}
        return (
            <EditModeContext.Consumer>
            {({isEditMode, toggleEditMode})=><UserTaskContext.Consumer>
                {({updateStatus})=>{
                    return <Draggable 
                        origin_list = {this.props.parent_list} 
                        source = {this}
                        doubleTapHandler = {()=>{updateStatus(this.props.task_id, !this.props.isCompleted)}}>

                        <Card>
                            <CardItem bordered>
                                <View style={{width:"100%", flexDirection:"row", alignItems: "center", justifyContent: "space-between"}}>
                                    <Text style={[{width:"80%"}, this.props.isCompleted ? strike_through_style : {}] }>{this.props.title || "Task"}</Text>
                                    <CardOptions style={{width:"20%"}} 
                                        task={task} 
                                        toggleDetails={this.toggleCard} 
                                        isCollapsed = {this.state.isCollapsed} 
                                        details={this.props.details} 
                                        isEditMode = {isEditMode}/>
                                </View>
                            </CardItem>

                            <Collapsible collapsed = {this.state.isCollapsed}>
                                <CardItem style={{backgroundColor: "#eee"}}>
                                    <Body>
                                        <Text>
                                            {this.props.details || ""}
                                        </Text>
                                    </Body>
                                </CardItem>
                            </Collapsible>
                        </Card>

                    </Draggable>
                }}
            </UserTaskContext.Consumer>
            }
            </EditModeContext.Consumer>)
    }
}

TaskCard.propTypes = {
    parent_list: PropTypes.any.isRequired,
    task_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string,
    details : PropTypes.string,
    isCompleted: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf([0,1]),
      ]).isRequired,
    
}