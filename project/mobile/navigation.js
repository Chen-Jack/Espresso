import React from 'react'
import {createStackNavigator} from 'react-navigation'
import LandingScreen from './screens/landing'
import RegistrationScreen from './screens/registration'
import HomeScreen from './screens/home/home'
import LoginScreen from './screens/login';
import SandBox from './screens/sandbox'
import SettingScreen from './screens/sandbox'

const StackNavigation = createStackNavigator({
    home: HomeScreen,
    sandbox : SandBox,
    landing: LandingScreen,
    login: LoginScreen,
    registration: RegistrationScreen,
    settings: SettingScreen
})

export default ()=>{
    return <StackNavigation/>
}


