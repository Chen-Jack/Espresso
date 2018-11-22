import React from 'react'
import {Card, CardItem, Text, Body} from 'native-base'
import {Draggable} from './../TravelingList'
import PropTypes from 'prop-types'
import UserTaskContext from '../../UserTaskContext'

export default class TaskCard extends React.Component{
    constructor(props) {
        super(props)

    }
    render(){
        let strike_through_style = {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}
        return (
            <UserTaskContext.Consumer>
                {({updateStatus})=>{
                    return <Draggable doubleTapHandler = {()=>{updateStatus(this.props.task_id, !this.props.isCompleted)}}>
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
                    </Draggable>
                }}
            </UserTaskContext.Consumer>)
    }
}

TaskCard.propTypes = {
    task_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string,
    details : PropTypes.string,
    isCompleted: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf([0,1]),
      ]).isRequired,
    
}