import React from 'react'
import Carousel from 'react-native-snap-carousel'
import {View,Button, Text, Card, CardItem, Body} from 'native-base'
import {Dimensions} from 'react-native'
import TravelingCard from './TravelingCard'
import TravelableList from './TravelableList'

class TaskCard extends React.Component{
    //Every task includes a title (required), detail (optional), and date (optional)

    render(){
        return <Card>
            <CardItem header bordered>
                <Text>{this.props.date}</Text>
            </CardItem>

            <CardItem bordered>
                <Text>{this.props.title}</Text>
            </CardItem>

            <CardItem>
             <Body>
               <Text>
                    {this.props.detail}
               </Text>
             </Body>
           </CardItem>
       </Card>
    }
}


export default class TaskCarousel extends React.Component{
    constructor(props) {
        super(props)
        
        this.carousel = React.createRef()
        this.state = {
            canScroll: true,
            scrollAmountToScroll : 20 // Default for carousel
        }
    }

 

    updateToDate = (date)=>{
        console.log("CALLED!!!")
        const index = this.props.task_data.findIndex((task)=>{
            console.log("TEST", task.date, "===?", date);
            return task.date === date ? true : false
        })

        console.log("INDEX IS", index);
        if(index)
            this.carousel.current.snapToItem(index)
    }

    _handleCardSelection = (data_index)=>{
        const iso_date = this.props.task_data[data_index].date;
        this.props.handleDateSelection(iso_date)
    }

    _renderTaskList = ({item: task, index})=>{
        mockdata = index === 0 ? [1,2,3,4,5] : [1,2,3]
        return <TravelableList key={index} onStartScroll={this._disableScroll} onStopScroll={this._enableScroll} data = {mockdata}/>
    }

    _disableScroll = ()=>{
        console.log("idk");
        this.setState({
            canScroll: false
        })
    }
    _enableScroll = ()=>{
        this.setState({
            canScroll: true
        })
    }

    
    render(){
    
        return (
            <View style={{padding: 10, backgroundColor:"papayawhip"}}>
                <Carousel
                    ref = {this.carousel}
                    firstItem = {20}
                    onSnapToItem = {this._handleCardSelection}
                    layout={'default'} 
                    data={this.props.task_data}
                    renderItem={this._renderTaskList}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width*3/4}
                    scrollEnabled = {this.state.canScroll}
                    useScrollView = {true}
                />
            </View>
        )
    }
}