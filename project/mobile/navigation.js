import React from 'react'
import {createStackNavigator} from 'react-navigation'
import LandingScreen from './screens/landing'
import TestScreen from './screens/test'
import RegistrationScreen from './screens/registration'
import HomeScreen from './screens/home/home'
import LoginScreen from './screens/login';
import SandBox from './screens/sandbox'

const StackNavigation = createStackNavigator({
    landing: LandingScreen,
    test: TestScreen,
    home: HomeScreen,
    login: LoginScreen,
    registration: RegistrationScreen,
    sandbox : SandBox
})

export default ()=>{
    return <StackNavigation/>
}


