import React from 'react'
import {View, TextInput} from 'react-native'

interface FilterBarProps {
    onChangeText : (new_text : string) => void
}
interface FilterBarState{
    text: string
}
export default class FilterBar extends React.Component<FilterBarProps, FilterBarState>{
    MAX_CHAR_LIMIT : number
    
    constructor(props : FilterBarProps) {
        super(props)

        this.state = {
            text : ""
        }

        this.MAX_CHAR_LIMIT = 30
    }

    _changeTextHandler = (new_text : string)=>{
        
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
                        placeholder="Filter"
                        onChangeText={this._changeTextHandler} 
                        style={{flex: 1, padding: 10, color: "white"}}/>
                </View>
            </View>
    }
}