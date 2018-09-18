import React from 'react'
import {createStackNavigator} from 'react-navigation'
import LandingScreen from './screens/landing'
import TestScreen from './screens/test'
import RegistrationScreen from './screens/registration'
import HomeScreen from './screens/home'
import LoginScreen from './screens/login';

const StackNavigation = createStackNavigator({
    login: LoginScreen,
    registration: RegistrationScreen,
    test: TestScreen,
    landing: LandingScreen,
    home: HomeScreen,
    
})

export default ()=>{
    return <StackNavigation/>
}


