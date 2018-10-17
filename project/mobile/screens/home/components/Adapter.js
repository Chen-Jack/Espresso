//A class that facilitates communication between two TravelableList's. 
// This acts as a common ground for data that both lists need access to to allow traversal

import TravelingCard from './TravelingCard'
import React from 'react'
import {Text} from 'react-native'

class Adapter extends React.Component{
    constructor(params) {
        
        this.TravelingComponent = TravelingCard

        this.activeItem = null

        this.drawerList = null
        this.carouselList = null
    }


    render(){
        return <Text></Text>
    }
}


export default Adapter

