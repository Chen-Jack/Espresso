import React from 'react'
import {View, Button, TouchableOpacity, Animated, Dimensions} from 'react-native'
import Modal from 'react-native-modal'
import MenuOptions from './MenuOptions'
import {EditModeContext, UserTaskContext} from './../../Context'
import { Coordinate , Layout} from '../../../../utility';
import ExitEditModeButton from './ExitEditModeButton'
import MenuButton from './MenuButton'



interface PopupMenuProps{

}

interface PopupMenuState{
    location : Coordinate,
    dimensions: Layout,
    isVisible: boolean
}

export default class PopupMenu extends React.Component<PopupMenuProps, PopupMenuState>{
    menu : React.RefObject<any>
    options: React.RefObject<any>

    constructor(props: PopupMenuProps) {
        super(props)

        this.menu = React.createRef()
        this.options = React.createRef()

        this.state = {
            location : {x:0, y:0},
            dimensions : {x: 0, y: 0, width: 0, height: 0},
            isVisible : false
        }

     
    }

    componentDidMount(){
        this.popupOptions = [
            {
                title: "Edit",
                handler: this.menu.current.props.toggleEditMode
            },
            {
                title: "Clear",
                handler: this.deallocateAllTasks
            }
        ]
    }

    componentWillUnmount(){
        console.log("Popupmenu unmounted");
    }
    
    toggleMenu = ()=>{
        if(!this.state.isVisible){
            Promise.all([
                new Promise((resolve,reject)=>{
                    this.menu.current.measure((x,y,width,height,pageX,pageY)=>{
                        const location = {x :pageX,y:pageY}
                        this.setState({
                            location: location
                        }, resolve)
                    })
                }),
                new Promise((resolve)=>{
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
        return <EditModeContext.Consumer>
            { ({isEditMode, toggleEditMode})=>{return (
            
            <View ref={this.menu} toggleEditMode={toggleEditMode}>

                {isEditMode ? <ExitEditModeButton options = {this.props.popupOptions}/> : <MenuButton openMenu={this.toggleMenu}/>}

                <View ref={this.options} >
                    <Modal
                        style = {{margin:0,position:"absolute", width:"100%", height:"100%"}}
                        backdropOpacity = {0.2}
                        onBackdropPress={this.toggleMenu}
                        visible = {this.state.isVisible}>

                        <View style={{
                            margin: 0, position:"absolute", 
                            justifyContent:"center", 
                            alignItems:"center", 
                            top:this.state.location.y, 
                            left:this.state.location.x-100, 
                            backgroundColor:"white",
                            shadowOpacity:0.5, shadowColor:"black", 
                            shadowOffset:{width:5, height:5}, 
                            shadowRadius:3}}>

                            <MenuOptions onChooseOption={this.toggleMenu} options={this.popupOptions}/>
                        </View>

                    </Modal>
                </View>
            </View>

        )}}
        </EditModeContext.Consumer>
    }
}