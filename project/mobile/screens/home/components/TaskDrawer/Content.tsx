import React from 'react'
import PropTypes from 'prop-types'
import TaskList from '../TaskCarousel/TaskList'
import {View, Text, Dimensions, TextInput} from 'react-native'
import {Icon, Button, Thumbnail, Image} from 'native-base'
import {TaskCreationPrompt} from './../TaskForm'
import {PopupMenu} from './../PopupMenu'

const UnallocatedTasksHeader = ({task_list})=>{
    // const menuOptions = [{
    //     title : "Edit",
    //     handler : function(){}
    // }]

    return <View style={{
            backgroundColor: "#222", 
            height: 35, width:"100%", 
            flexDirection:"row", 
            justifyContent:"space-between", 
            alignItems:"center", 
            borderTopLeftRadius : 10, 
            borderTopRightRadius : 10}}>

            <Text style={{color:"white", marginHorizontal: 10}}> {task_list.length} tasks </Text>
            {/* <PopupMenu isEditMode={false} popupOptions={menuOptions}/> */}

        </View>
}

class FilterBar extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            text : ""
        }

        this.MAX_CHAR_LIMIT = 30
    }

    _changeTextHandler = (new_text)=>{
        
        this.setState({
            text : new_text
        }, ()=>{
            this.props.onChangeText(this.state.text)
        })
        
    }

    render(){
        return <View style={{width:"100%", padding: 5}}>
                <View style={{backgroundColor: "#555", height: 35, width:"100%", flexDirection:"row", justifyContent:"center", alignItems:"center", borderRadius: 10}}>
                    <TextInput 
                        value={this.state.text}
                        maxLength = {this.MAX_CHAR_LIMIT}
                        placeholderTextColor="white" 
                        placeholder="Filter" value={this.state.text} 
                        onChangeText={this._changeTextHandler} 
                        style={{flex: 1, padding: 10, color: "white"}}/>
                </View>
            </View>
    }
}

FilterBar.propTypes = {
    onChangeText : PropTypes.func.isRequired
}

const DrawerHeader = ()=>{
    const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png"
    return <View style={{padding: 0, margin:0, alignItems: "center", justifyContent:"center", backgroundColor:"#222", height: "25%", width:"100%"}}>
        <Thumbnail large source={{uri:uri}}/>

        <Text style={{ fontSize:20, color:"white"}}> Unallocated Tasks </Text>
    </View>
}

export default class DrawerContent extends React.Component{
    constructor(props) {
        super(props)
        
        this.state = {
            filter_text : ""
        }

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

    _onFilterBarChangeText = (new_text)=>{
        console.log("changing text to", new_text);
        this.setState({
            filter_text : new_text
        })
    }

    filterTaskList = (task_list)=>{
        return task_list.filter((task)=>{
            if(task.title.includes(this.state.filter_text))
                return true
            else
                return false
        })
    }

    togglePrompt = ()=>{
        this.form.togglePrompt()
    }

    render(){
        return (
        <View style={{backgroundColor: "#ddd", height: Dimensions.get('window').height, width: "100%"}}>

            <DrawerHeader />
            <FilterBar onChangeText={this._onFilterBarChangeText}/>
            
            <View 
                ref = {this.list}
                style={{padding: 5, flex: 1}}>

                <UnallocatedTasksHeader task_list={this.props.task_data}/>
                <TaskList
                    ref={(ref)=>{this.list}}
                    data = {{
                        date: null,
                        tasks: this.filterTaskList(this.props.task_data)
                    }}
                />
            </View>

            <View style={{width:"100%", flexDirection:"row", justifyContent:"center"}}>
                <TaskCreationPrompt ref={(ref=>{this.form = ref})}/>
                <Button style={{borderRadius:100, marginVertical: 10, backgroundColor:"#222"}} onPress={this.togglePrompt}>
                    <Icon name='add' />
                </Button>
            </View>

        </View>
        )
    }
}

DrawerContent.propTypes = {
    task_data : PropTypes.array.isRequired
}