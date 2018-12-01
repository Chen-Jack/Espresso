import React from 'react'
import {Card, CardItem, Text, Body,Button, View, Badge, Icon} from 'native-base'
import {TouchableOpacity} from 'react-native'
import {Draggable} from './../TravelingList'
import PropTypes from 'prop-types'
import UserTaskContext from '../../UserTaskContext'
import Collapsible from 'react-native-collapsible';

class EditButtons extends React.Component{
    render(){
        return <View style={{flexDirection:"row"}}>
            <TouchableOpacity>
                <Icon style={{fontSize:20, marginHorizontal: 5}} type={"FontAwesome"} name="pencil"/>
            </TouchableOpacity>

            <TouchableOpacity>
                <Icon style={{fontSize:20, marginHorizontal: 5}} name="trash"/>
            </TouchableOpacity>
        </View>
    }
}

const CardOptions = ({details, isEditMode, isCollapsed})=>{
    if(isEditMode){
        return <View style={{flexDirection:"row",alignItems:"center"}}>
            <EditButtons/>
        </View>
    }
    else if(details){
        return <TouchableOpacity onPress={this.toggleCard}>
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
                                    <Text style={this.props.isCompleted ? strike_through_style : {} }>{this.props.title || "Task"}</Text>
                                    <CardOptions isCollapsed = {this.state.isCollapsed} details={this.props.details} isEditMode = {this.props.isEditMode}/>
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