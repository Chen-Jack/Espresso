import React from 'react'
import {Card, CardItem, Text, Body,Button, View, Badge, Icon} from 'native-base'
import {TouchableOpacity} from 'react-native'
import {Draggable} from './../TravelingList'
import PropTypes from 'prop-types'
import UserTaskContext from '../../UserTaskContext'
import Collapsible from 'react-native-collapsible';

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
                                <View style={{width:"100%", flexDirection:"row", justifyContent: "space-between"}}>
                                    <Text style={this.props.isCompleted ? strike_through_style : {} }>{this.props.title || "Task"}</Text>
                                    <TouchableOpacity onPress={this.toggleCard}>
                                        {this.state.isCollapsed ? <Icon name="arrow-dropdown"/> : <Icon name="arrow-dropup"/>}  
                                    </TouchableOpacity>
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
    isCompleted: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf([0,1]),
      ]).isRequired,
    
}