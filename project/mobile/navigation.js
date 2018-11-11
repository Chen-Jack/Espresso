import React from 'react'
import {createStackNavigator} from 'react-navigation'
import LandingScreen from './screens/landing'
import TestScreen from './screens/test'
import RegistrationScreen from './screens/registration'
import HomeScreen from './screens/home/home'
import LoginScreen from './screens/login';
import SandBox from './screens/sandbox'

const StackNavigation = createStackNavigator({
    home: HomeScreen,
    sandbox : SandBox,
    landing: LandingScreen,
    test: TestScreen,
    login: LoginScreen,
    registration: RegistrationScreen,
})

export default ()=>{
    return <StackNavigation/>
}


