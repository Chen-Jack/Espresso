import React from 'react'
import PropTypes from 'prop-types'
import {List, Text, ListItem} from 'native-base'
import {TouchableOpacity} from 'react-native'


export default class MenuOptions extends React.Component{

    render(){
        return <List style={{width: "100%"}}>
            <ListItem>
                <TouchableOpacity>
                    <Text> Option 1</Text>
                </TouchableOpacity>
            </ListItem>

            <ListItem>
                <TouchableOpacity>
                    <Text> Option 1</Text>
                </TouchableOpacity>
            </ListItem>

            <ListItem>
                <TouchableOpacity>
                    <Text> Option 1</Text>
                </TouchableOpacity>
            </ListItem>
             
        </List>
    }
}

MenuOptions.propTypes = {

}