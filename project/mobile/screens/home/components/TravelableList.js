import React from 'react'
import {FlatList, Text, Dimensions, View, Modal as ModalFocus} from 'react-native'
import TravelingCard from './TravelingCard'
import { Button } from 'native-base';


export default class LandableList extends React.Component{
    constructor(props) {
        super(props)

        this.state= {
            allowScroll: false,
            card_focus: false
        }
    }

    createPseudoCard = ()=>{
        
    }

    _disableScroll = ()=>{
        console.log("Calledds");
        this.setState({
            allowScroll : false
        })

        //Prevent scrolling for carousel
        this.props.onStartScroll()
    }

    _startScroll = ()=>{
        this.setState({
            allowScroll: true
        })

        // ALlow scrolling Again
        this.props.onStopScroll()
    }

    _showFocus = ({nativeEvent})=>{
        const click_x = nativeEvent.pagex
        const click_y = nativeEvent.pagey
        console.log("e is", nativeEvent);
        console.log(click_x, click_y);
        // this.setState({
        //     card_focus : true
        // })
    }
    
    render(){
        return <View>
            <Button onLongPress={this._showFocus} onPress={()=>{console.log("hm")}}>
                <Text> Show modal </Text>
            </Button>

            <ModalFocus style={{height:"50%"}} visible={this.state.card_focus} transparent = {true}>
                <TravelingCard title="?"/>
            </ModalFocus>
                
            <FlatList
            scrollEnabled = {this.state.allowScroll}
            style = {{padding:10, margin: 0, backgroundColor:"green", /*overflow:'visible'*/}}
            data = {this.props.data}
            renderItem = {({item: task, index})=>{
                return <TravelingCard 
                    key = {index}
                    title={task.title} 
                    created_at={task.created_at} 
                    details={task.details}
                    
                    onStartMove = {this._disableScroll}
                    onStopMove = {this._startScroll}
                    />
            }}/>
        </View>
    }
}

