import React from 'react'
import PropTypes from 'prop-types'
import {List, Text, ListItem, View} from 'native-base'
import {TouchableOpacity} from 'react-native'

export default class MenuOptions extends React.Component{
    constructor(props) {
        super(props)
        console.log("RECEIVED", this.onChooseOption, this.props.options, );
    }

    _renderItems = ()=>{
        console.log("options", this.props.options);
        return this.props.options.map((option, index)=>{
            return <ListItem key={index}>
                <TouchableOpacity onPress={()=>option.handler(this.props.toggleMenu)}>
                    <Text> {option.title} </Text>
                </TouchableOpacity>
            </ListItem>
        })
    }
    render(){
        return <List style={{width: 100}}>
            {this._renderItems()}
        </List>
    }
}

MenuOptions.propTypes = {
    onChooseOption : PropTypes.func,
    options : PropTypes.arrayOf(
        PropTypes.shape({
            title : PropTypes.string.isRequired,
            handler : PropTypes.func.isRequired
        })
    ).isRequired
}