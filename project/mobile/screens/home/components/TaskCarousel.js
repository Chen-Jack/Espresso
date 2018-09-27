import React from 'react'
import Carousel from 'react-native-snap-carousel'
import {View,Button, Text, Card, CardItem, Body} from 'native-base'
import {Dimensions} from 'react-native'

class TaskCard extends React.Component{
    //Every task includes a title (required), detail (optional), and date (optional)

    render(){
        return (<Card>
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
       </Card>)
    }
}


export default class TaskCarousel extends React.Component{
    constructor(props) {
        super(props)
        
        this.carousel = React.createRef()

    }

 

    updateToDate = (date)=>{
     
        if(this.props.task_data.includes(date)){
            const index = this.props.task_data.indexOf(date)
            this.carousel.current.snapToItem(index)
        }
    }

    _renderTaskCard = ({item: task, index})=>{
        console.log("Item", task);
        //By default in React Native/JS, every item in the data array is called item.
        return <TaskCard index={index} title={task.title} detail={task.detail} date={task.date}/>
    }

    _handleCardSelection = (data_index)=>{
        const iso_date = this.props.task_data[data_index].date;
        this.props.handleDateSelection(iso_date)
    }

    
    render(){
    
        return (
            <Carousel
                ref = {this.carousel}
                firstItem = {0}
                // firstItem = {30}
                onSnapToItem = {this._handleCardSelection}
                layout={'default'} 
                data={this.props.task_data}
                renderItem={this._renderTaskCard}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width*3/4}
            />
        )
    }
}