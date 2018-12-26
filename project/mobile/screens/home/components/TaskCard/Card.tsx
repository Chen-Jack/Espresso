import React from 'react'
import {Card, CardItem, Text, Body, View} from 'native-base'
import {Draggable} from './../TravelingList'
import {UserTaskContext, EditModeContext} from '../../Context'
import Collapsible from 'react-native-collapsible';
import CardOptions from './CardOptions'
import { Taskable } from '../../../../Task';
import {Travelable} from './../TravelingList/Embassy'
import { Animated } from 'react-native';
import { AnimatedValue } from 'react-navigation';

// KYAAAAAaaaA~ x3 xD
/*
I love shelly <3 doki doki :3 xD xP :T :p :P x3 83 ^__^ >__> >__< >x< owo o3o o-o O_O o.o o-O O-O Q_Q T-T T_T *_* ^-^ x_x @_@ 
    -_- n_n .___. (> ^^ )> .-. ~_~ 8D 8-D >:D :^) ^o^ u_u :) :o 8===D 
*/

interface TaskCardProps{
    parent_list : any,
    task: Taskable
    index ?: number
}

interface TaskCardState{
    isCollapsed: boolean,
    opacity: AnimatedValue
}

export default class TaskCard extends React.Component<TaskCardProps, TaskCardState> implements Travelable{
    constructor(props : TaskCardProps) {
        super(props)

        this.state={
            isCollapsed : true,
            opacity: new Animated.Value(1)
        }
    }
    ghost = ()=>{
        Animated.timing(
            this.state.opacity,
            {
                toValue: 0.75,
                duration: 300
            }
        ).start()
    }

    materialize = ()=>{
        Animated.timing(
            this.state.opacity,
            {
                toValue: 1,
                duration: 300
            }
        ).start()
    }

    getID = ()=>{
        return this.props.task.task_id
    }
    getDate = ()=>{
        return this.props.task.allocated_date
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
                    // console.log("The card is in edit mode? ", isEditMode);
                    return <Draggable 
                        origin_list = {this.props.parent_list} 
                        source = {this}
                        doubleTapHandler = {()=>{updateStatus(this.props.task.task_id, !this.props.task.completed)}}>
                        <Animated.View style={{opacity: this.state.opacity}}>
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
                        </Animated.View>
                    </Draggable>
                }}
            </UserTaskContext.Consumer>
            }
            </EditModeContext.Consumer>)
    }
}
