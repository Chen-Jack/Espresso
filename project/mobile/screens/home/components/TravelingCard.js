import React from 'react'
import {TouchableHighlight} from 'react-native'
import {Badge, Item, Card, CardItem,Text, View} from 'native-base'
import Modal from 'react-native-modal'


export default class TravelingCard extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            detailedViewVisible : false
        }
    }

    render(){
        return <Card >
            <CardItem header bordered>
                <Text> {this.props.title} </Text>
            </CardItem>
        </Card>
    }
}