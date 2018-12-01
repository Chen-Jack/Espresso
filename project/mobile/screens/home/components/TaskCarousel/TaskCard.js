import React from 'react'
import {Card, CardItem, Text, Body,Button, View, Badge, Icon,Input} from 'native-base'
import {TouchableOpacity, Alert, TextInput} from 'react-native'
import {Draggable} from './../TravelingList'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import UserTaskContext from '../../UserTaskContext'
import Collapsible from 'react-native-collapsible';

class EditButton extends React.Component{
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
                <View style={{padding: 10, backgroundColor:"#ddd"}}>
                    <Input placeholder={"Title"} value={"test"}/>
                    <Input placeholder={"Details (Optional)"} value={"details"}/>
                    <Button> <Text>Update</Text> </Button>
                </View>
            </Modal>
        </View>
    }
}

class DeleteButton extends React.Component{
    constructor(props) {
        super(props)

       
    }

    triggleDeletePrompt = (deleteHandler)=>{
        Alert.alert('Delete Card', "Are you sure?", 
        [
            {text: "Cancel", onPress:()=>{}, style:"cancel"},
            {text:"Delete", onPress:()=>{deleteHandler(this.props.task_id)}}
        ])
    }

    render(){
        return <UserTaskContext.Consumer>
            { ({deleteTask})=> <View>
                <TouchableOpacity onPress={()=>this.triggleDeletePrompt(deleteTask)}>
                    <Icon style={{fontSize:20, marginHorizontal: 5}} name="trash"/>
                </TouchableOpacity>
                </View>
            }
        </UserTaskContext.Consumer>
    }
}

DeleteButton.propTypes = {
    task_id : PropTypes.string.isRequired
}

class EditButtons extends React.Component{
    render(){
        return <View style={{flexDirection:"row"}}>
            <EditButton task_id = {this.props.task_id}/>

            <DeleteButton task_id = {this.props.task_id}/>
        </View>
    }
}

const CardOptions = ({task_id, details, isEditMode, isCollapsed, toggleDetails})=>{
    if(isEditMode){
        return <View style={{flexDirection:"row",alignItems:"center"}}>
            <EditButtons task_id = {task_id}/>
        </View>
    }
    else if(details){
        return <TouchableOpacity onPress={toggleDetails}>
            {isCollapsed ? <Icon name="arrow-dropdown"/> : <Icon name="arrow-dropup"/>}  
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
        let strike_through_style = {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}
        return (
            <UserTaskContext.Consumer>
                {({updateStatus})=>{
                    return <Draggable 
                        origin_list = {this.props.parent_list} 
                        source = {this}
                        doubleTapHandler = {()=>{updateStatus(this.props.task_id, !this.props.isCompleted)}}>
                        <Card>
                            <CardItem bordered>
                                <View style={{width:"100%", flexDirection:"row", alignItems: "center", justifyContent: "space-between"}}>
                                    <Text style={[{width:"80%"}, this.props.isCompleted ? strike_through_style : {}] }>{this.props.title || "Task"}</Text>
                                    <CardOptions style={{width:"20%"}}task_id= {this.props.task_id} toggleDetails={this.toggleCard} isCollapsed = {this.state.isCollapsed} details={this.props.details} isEditMode = {this.props.isEditMode}/>
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
            </UserTaskContext.Consumer>)
    }
}

TaskCard.propTypes = {
    parent_list: PropTypes.any.isRequired,
    task_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string,
    details : PropTypes.string,
    isEditMode : PropTypes.bool.isRequired,
    isCompleted: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf([0,1]),
      ]).isRequired,
    
}