import React from 'react'
import {View, FlatList, Text, Header, Animated, Dimensions, TouchableHighlight} from 'react-native'
import {Badge, Item, Card, CardItem} from 'native-base'
import Modal from 'react-native-modal'
import TravelingCard from './TravelingCard'
import TravelableList from './TravelableList'

export default class TaskDrawer extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }

    }

    toggleDrawer = ()=>{
        const next_state = !this.state.visible
        this.setState({
            visible: next_state
        })
    }


    render(){
        return (
        <View>  
            {/* The component responsible for calling the drawer */}
            <TouchableHighlight
                onPress={this.toggleDrawer}>     
                <Badge info>
                    {/* style={{position: "absolute", top: 0}}  */}
                    <Text>
                        S
                    </Text>
                </Badge>
            </TouchableHighlight> 

            <Modal
                animationInTiming = {800}
                animationOutTiming = {800}
                animationIn = {"slideInDown"}
                animationOut = {"slideOutUp"}
                isVisible = {this.state.visible}
                onBackdropPress = {()=>this.toggleDrawer()}
                hideModalContentWhileAnimating = {true}
                style={{padding: 0, margin: 0}}>
                
                <View style={{padding:0, margin:0, position: "absolute", top: 0, left:0, backgroundColor: "#efefef", width: Dimensions.get('window').width, height:Dimensions.get('window').height*0.75}}>
                  <Text> Tasks </Text>

                  <TravelableList 
                    data = {this.task_data}
                    renderItem = {({item: task, index})=>{
                        return <TravelingCard title={task.title} created_at={task.created_at} details={task.details}/>
                    }}/>

                </View>
            
            </Modal>

        </View>

    )}
}