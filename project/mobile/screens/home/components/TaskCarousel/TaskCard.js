import React from 'react'
import {Card, CardItem, Text, Body} from 'native-base'
import PropTypes from 'prop-types'

export default class TaskCard extends React.Component{
    constructor(props) {
        super(props)
    }
    
  
    render(){
        return <Card>
            <CardItem bordered>
                <Text>{this.props.title || "Title"}</Text>
            </CardItem>

            <CardItem>
                <Text>{this.props.isCompleted ? "Done" : "Unfinished"}</Text>
            </CardItem>

            <CardItem>
                <Body>
                    <Text>
                        {this.props.details || ""}
                    </Text>
                </Body>
            </CardItem>
        </Card>
    }
}

TaskCard.propTypes = {
    title: PropTypes.string.isRequired,
    details : PropTypes.string,
    isCompleted: PropTypes.bool.isRequired
}