import React from 'react'
import {View, Button, TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import MenuOptions from './MenuOptions'

export default class TaskPopupMenu extends React.Component{
    constructor(props) {
        super(props)

        this.menu = React.createRef()
        this.state = {
            location : {x:0, y:0},
            isVisible : false
        }
    }

    componentWillUnmount(){
        console.log("Popupmenu unmounted");
    }
    toggleMenu = ()=>{
        if(!this.state.isVisible){
            this.menu.current.measure((x,y,width,height,pageX,pageY)=>{
                const location = {x :pageX,y:pageY}
                this.setState({
                    location: location,
                    isVisible : !this.state.isVisible
                }, ()=>{
                    console.log("Menu is now", this.state.isVisible, "at", this.state.location);
                })
            })
        }
        else{
            this.setState({
                isVisible: !this.state.isVisible
            })
        }
    }


    render(){
        return <View ref={this.menu}>

                <TouchableOpacity  onPress={(evt)=>this.toggleMenu(evt)} style={{marginRight: 15}}>
                    <Icon style={{color:"white"}} name="more"/>
                </TouchableOpacity>

                <View>
                    <Modal
                            style = {{margin:0,position:"absolute", width: 100}}
                            backdropOpacity = {0}
                            onBackdropPress={this.toggleMenu}
                            visible = {this.state.isVisible}>

                            <View style={{margin: 0, position:"absolute", justifyContent:"center", alignItems:"center", top:this.state.location.y, left:this.state.location.x-100, width: 100, backgroundColor:"white"}}>
                                <MenuOptions/>
                            </View>

                    </Modal>
                </View>
            </View>
           
    }
}

TaskPopupMenu.propTypes = {
    date : PropTypes.string.isRequired
}