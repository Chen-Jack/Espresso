import React from 'react'
import {createStackNavigator} from 'react-navigation'
import LandingScreen from './screens/landing'
import TestScreen from './screens/test'

const StackNavigation = createStackNavigator({
    test: TestScreen,
    landing: LandingScreen
})

export default ()=>{
    return <StackNavigation/>
}


