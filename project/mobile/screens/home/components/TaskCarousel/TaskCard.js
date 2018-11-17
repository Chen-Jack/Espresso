import React from 'react'
import {Card, CardItem, Text, Body} from 'native-base'
import {Draggable} from './../TravelingList'
import PropTypes from 'prop-types'

export default class TaskCard extends React.Component{
    constructor(props) {
        super(props)
    }
    
    _handleDoubleTap = ()=>{
        console.log("Double Tap");
    }
  
    render(){
        return (
            <Draggable doubleTapHandler = {this._handleDoubleTap}>
                <Card>
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
        </Draggable> )
    }
}

TaskCard.propTypes = {
    title: PropTypes.string.isRequired,
    details : PropTypes.string,
    isCompleted: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf([0,1]),
      ]).isRequired,
    
}