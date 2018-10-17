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
                
                <View style={{padding:10, margin:0, position: "absolute", zIndex:0, backgroundColor: "orange", width: Dimensions.get('window').width, }}>
                  {/* <Text style={{padding:0, margin:0}}> Tasks </Text> */}

                  <TravelableList 
                    data = {this.props.task_data}
                    travelingComponent = {TravelingCard}/>

                </View>
            
            </Modal>

        </View>

    )}
}