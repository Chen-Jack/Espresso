import React from 'react'
import {Card, CardItem, Text, Body, View} from 'native-base'
import {Draggable} from './../TravelingList'
import {UserTaskContext, EditModeContext} from '../../Context'
import Collapsible from 'react-native-collapsible';
import CardOptions from './CardOptions'


interface TaskCardProps{
    parent_list : any,
    task_id : string,
    title: string,
    date : string | null,
    details: string | null,
    isCompleted : boolean | number
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
                {({updateStatus} : any)=>{
                    return <Draggable 
                        origin_list = {this.props.parent_list} 
                        source = {this}
                        doubleTapHandler = {()=>{updateStatus(this.props.task_id, !this.props.isCompleted)}}>

                        <Card>
                            <CardItem bordered>
                                <View style={{width:"100%", flexDirection:"row", alignItems: "center", justifyContent: "space-between"}}>
                                    <Text 
                                        style={
                                            [{width:"80%"}, this.props.isCompleted && strike_through_style] 
                                        }>
                                        {this.props.title || "Task"}
                                    </Text>
                                    
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
