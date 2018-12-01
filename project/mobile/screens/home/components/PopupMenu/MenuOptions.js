import React from 'react'
import PropTypes from 'prop-types'
import {List, Text, ListItem} from 'native-base'
import {TouchableOpacity} from 'react-native'


export default class MenuOptions extends React.Component{

    render(){
        return <List style={{width: "100%"}}>
            <ListItem>
                <TouchableOpacity>
                    <Text> Edit </Text>
                </TouchableOpacity>
            </ListItem>

            <ListItem>
                <TouchableOpacity>
                    <Text> Move All To Board </Text>
                </TouchableOpacity>
            </ListItem>

            <ListItem>
                <TouchableOpacity>
                    <Text> Complete All </Text>
                </TouchableOpacity>
            </ListItem>
             
        </List>
    }
}

MenuOptions.propTypes = {
    // handlers
}