import React from 'react'
import {View, Text, Button, Dimensions} from 'react-native'
import Carousel from 'react-native-snap-carousel'


export default class SandBox extends React.Component{
    state={
        canScroll : true,
    }

    enableScroll = ()=>{
        this.setState({canScroll: true})
    }

    disableScroll = ()=>{
        this.setState({canScroll: false})
    }
    renderItems = ()=>{
        return <View style={{width:300, height: 300, backgroundColor:"orange"}}>
                <Text> Test </Text>
            </View>
    }
    render(){

        return (
            <View>

                <Button onPress={this.disableScroll} title={"Disable"}/>

                <Button onPress={this.enableScroll} title={"Enable"}/>
                
                <Carousel
                    scrollEnabled = {this.state.canScroll}
                    data={[1,2,3,4,5]}
                    renderItem={this.renderItems}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width}
                />
                
            </View>
        )
    }
}