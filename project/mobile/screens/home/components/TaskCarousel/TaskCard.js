import React from 'react'
import {Card, CardItem, Text, Body} from 'native-base'

export default function TaskCard(props){
    return <Card>
        <CardItem bordered>
            <Text>{props.title || "Title"}</Text>
        </CardItem>

        <CardItem>
            <Body>
                <Text>
                    {props.detail || ""}
                </Text>
            </Body>
        </CardItem>
    </Card>
}