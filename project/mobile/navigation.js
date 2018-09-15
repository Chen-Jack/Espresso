import React from 'react'
import {createStackNavigator} from 'react-navigation'
import LandingScreen from './screens/landing'
import TestScreen from './screens/test'
import RegistrationScreen from './screens/registration'
import HomeScreen from './screens/home'

const StackNavigation = createStackNavigator({
    registration: RegistrationScreen,
    test: TestScreen,
    landing: LandingScreen,
    home: HomeScreen
    
})

export default ()=>{
    return <StackNavigation/>
}


