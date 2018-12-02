import React from 'react'
import {View, Button, TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import MenuOptions from './MenuOptions'

const MenuButton = ({openMenu})=>{
    return <TouchableOpacity onPress={openMenu} style={{marginRight: 15}}>
        <Icon style={{color:"white"}} name="more"/>
    </TouchableOpacity>
}

const ExitEditModeButton = ({options})=>{
    let handler = ()=>{}
    for(let option of options){
        if(option.title === "Edit"){
            handler = option.handler
        }
    }
    console.log("handler", handler);
    return <TouchableOpacity onPress={()=>handler()} style={{marginRight: 15}}>
        <Icon type="FontAwesome" style={{color:"white"}} name="check"/>
    </TouchableOpacity>  
}


export default class TaskPopupMenu extends React.Component{
    constructor(props) {
        super(props)

        this.menu = React.createRef()
        this.options = React.createRef()

        this.state = {
            location : {x:0, y:0},
            dimensions : {width: 0, height: 0},
            isVisible : false
        }

     
    }

    componentWillUnmount(){
        console.log("Popupmenu unmounted");
    }

    menuOptionsLayout = ({nativeEvent: { layout: {x, y, width, height}}})=>{
        console.log("layout called");
        const dimensions = {width: width, height: height}
        this.setState({
            dimensions: dimensions
        })
    }
    
    toggleMenu = ()=>{
        console.log("refs are",this.options, this.menu.current);
        if(!this.state.isVisible){
            Promise.all([
                new Promise((resolve,reject)=>{
                    this.menu.current.measure((x,y,width,height,pageX,pageY)=>{
                        const location = {x :pageX,y:pageY}
                        console.log("THE LOCATIONIS  ", location);
                        this.setState({
                            location: location
                        }, resolve)
                    })
                }),
                new Promise((resolve,reject)=>{
                    //If the dimensions havent been measured yet
                    if(this.state.dimensions.width === 0 && this.state.dimensions.height === 0){
                        this.options.current.measure((x,y,width,height,pageX,pageY)=>{
                            const dimensions = {width :width,height:height}
                            console.log("measured to be", dimensions);
                            this.setState({
                                dimensions: dimensions
                            }, resolve)
                        })
                    }
                    else
                        resolve()
                })
            ]).then(()=>{
                this.setState({
                    isVisible : !this.state.isVisible
                }, ()=>{
                    console.log("toggled to", this.state.isVisible);
                })
            })
        }
        else{
            this.setState({
                isVisible: !this.state.isVisible
            }, ()=>{
                console.log("toggled to", this.state.isVisible);
            })
        }
    }


    render(){
        return <View ref={this.menu}>

            { 
                this.props.isEditMode ? 
                <ExitEditModeButton options = {this.props.popupOptions}/> : <MenuButton openMenu={this.toggleMenu}/>
            }

            <View ref={this.options} >
                <Modal
                    style = {{margin:0,position:"absolute", width:"100%", height:"100%"}}
                    backdropOpacity = {0.2}
                    onBackdropPress={this.toggleMenu}
                    visible = {this.state.isVisible}>

                    <View style={{margin: 0, position:"absolute", justifyContent:"center", alignItems:"center", top:0, left:0, backgroundColor:"white"}}>
                        <MenuOptions toggleMenu={this.toggleMenu} options={this.props.popupOptions}/>
                    </View>

                </Modal>
            </View>
        </View>
           
    }
}

TaskPopupMenu.propTypes = {
    date : PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    popupOptions : PropTypes.arrayOf(
        PropTypes.shape({
            title : PropTypes.string.isRequired,
            handler : PropTypes.func.isRequired
        })
    ).isRequired
}