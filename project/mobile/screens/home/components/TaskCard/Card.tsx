import React from 'react'
import {Card, CardItem, Text, Body, View} from 'native-base'
import {Draggable} from './../TravelingList'
import {UserTaskContext, EditModeContext} from '../../Context'
import Collapsible from 'react-native-collapsible';
import CardOptions from './CardOptions'
import { Taskable } from '../../../../Task';


interface TaskCardProps{
    parent_list : any,
    task: Taskable
    index ?: number
}

interface TaskCardState{
    isCollapsed: boolean
}

export default class TaskCard extends React.Component<TaskCardProps, TaskCardState>{
    constructor(props : TaskCardProps) {
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
        console.log("Card Mounting", this.props.task.task_id, this.props);
    }
    componentWillUnmount(){
        console.log("TaskCard Unmounting");
    }
    render(){
        
        let strike_through_style = {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}
        return (
            <EditModeContext.Consumer>
            {({isEditMode})=><UserTaskContext.Consumer>
                {({updateStatus} : any)=>{
                    return <Draggable 
                        origin_list = {this.props.parent_list} 
                        source = {this}
                        doubleTapHandler = {()=>{updateStatus(this.props.task.task_id, !this.props.task.completed)}}>

                        <Card>
                            <CardItem bordered>
                                <View style={{width:"100%", flexDirection:"row", alignItems: "center", justifyContent: "space-between"}}>
                                    <Text 
                                        style={
                                            [{width:"80%"}, this.props.task.completed && strike_through_style] 
                                        }>
                                        {this.props.task.title || "Task"}
                                    </Text>
                                    
                                    <CardOptions 
                                        style={{width:"20%"}} 
                                        task={this.props.task} 
                                        toggleDetails={this.toggleCard} 
                                        isCollapsed = {this.state.isCollapsed} 
                                        details={this.props.task.details} 
                                        isEditMode = {isEditMode}/>
                                </View>
                            </CardItem>

                            <Collapsible collapsed = {this.state.isCollapsed}>
                                <CardItem style={{backgroundColor: "#eee"}}>
                                    <Body>
                                        <Text>
                                            {this.props.task.details || ""}
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
