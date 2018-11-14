import React from 'react'
import {Card, CardItem, Text, Body} from 'native-base'

export default function TaskCard(props){
    return <Card>
        <CardItem bordered>
            <Text>{props.title || "Title"}</Text>
        </CardItem>

        <CardItem>
            <Text>{props.isCompleted ? "Done" : "Unfinished"}</Text>
        </CardItem>

        <CardItem>
            <Body>
                <Text>
                    {props.details || ""}
                </Text>
            </Body>
        </CardItem>
    </Card>
}