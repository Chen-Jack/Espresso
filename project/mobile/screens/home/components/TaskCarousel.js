import React from 'react'
import Carousel from 'react-native-snap-carousel'
import {Text, Card, CardItem, Body} from 'native-base'
import {Dimensions} from 'react-native'

class TaskCard extends React.Component{
    //Every task includes a title (required), detail (optional), and date (optional)
    constructor(props) {
        super(props)
    }

    render(){
        return (<Card>
            <CardItem header bordered>
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
        console.log("Called");
        console.log("Date is",date);
        console.log("Task data is", this.props.task_data);
     
        if(this.props.task_data.includes(date)){
            console.log("Get at it boi");
            const index = this.props.task_data.indexOf(date)
            this.carousel.current.snapToItem(index)
        }
    }

    _renderTaskCard = ({item,index})=>{
        return <TaskCard title={item} detail={"TEST"} />
    }

    _handleCardSelection = (data_index)=>{
        console.log("PROPS DATA is", this.props.task_data);
        console.log("DATA INDEX IS", data_index)
        const iso_date = this.props.task_data[data_index];
        console.log("ISO DATE IS", iso_date);
        this.props.handleDateSelection(iso_date)
    }

    
    render(){
        return (
            <Carousel
                ref = {this.carousel}
                onSnapToItem = {this._handleCardSelection}
                layout={'default'} 
                data={this.props.task_data}
                renderItem={this._renderTaskCard}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width/2}
            />
        )
    }
}