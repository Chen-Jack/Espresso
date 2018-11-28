import React from 'react'
import PropTypes from 'prop-types'
import TaskList from '../TaskCarousel/TaskList'
import {View, Text, Dimensions} from 'react-native'
import {TaskCreationPrompt} from './../TaskForm'

function DrawerHeader(){
    return <View style={{padding: 0, margin:0, alignItems: "center", justifyContent:"center", backgroundColor:"#222", height: "25%", width:"100%"}}>
        <Text style={{ fontSize:20, color:"white"}}> Unallocated Tasks </Text>
    </View>
}

export default class DrawerContent extends React.Component{
    constructor(props) {
        super(props)
        this.list = React.createRef()
    }

    componentWillUnmount(){
        console.log("Drawer Content unmounting");
    }

    measureLayout = (cb=()=>{})=>{
        this.list.current.measure((x,y,width,height,pageX,pageY)=>{
            const layout = {
                x: pageX,
                y: pageY,
                width: width,
                height: height
            }
            cb(layout);
        })     
    }

    render(){

        return (
        <View style={{backgroundColor: "#ddd", height: Dimensions.get('window').height, width: "100%"}}>

            <DrawerHeader />

            <View 
                ref = {this.list}
                style={{padding:10, flex: 1}}>
                <TaskList
                    ref={(ref)=>{this.list}}
                    data = {{
                        date: null,
                        tasks: this.props.task_data
                    }}
                />
            </View>
            <View style={{width:"100%", flexDirection:"row", justifyContent:"center"}}>
                <TaskCreationPrompt />
            </View>
        </View>
        )
    }
}

DrawerContent.propTypes = {
    task_data : PropTypes.array.isRequired
}