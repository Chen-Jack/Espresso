import React from 'react'
import {createStackNavigator} from 'react-navigation'
import LandingScreen from './screens/landing'
import TestScreen from './screens/test'
import RegistrationScreen from './screens/registration'
import HomeScreen from './screens/home/home'
import LoginScreen from './screens/login';

const StackNavigation = createStackNavigator({
    landing: LandingScreen,
    test: TestScreen,
    home: HomeScreen,
    login: LoginScreen,
    registration: RegistrationScreen,
})

export default ()=>{
    return <StackNavigation/>
}


