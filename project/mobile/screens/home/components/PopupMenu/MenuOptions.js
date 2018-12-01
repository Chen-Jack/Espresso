import React from 'react'
import PropTypes from 'prop-types'
import {List, Text, ListItem, View} from 'native-base'
import {TouchableOpacity} from 'react-native'
import UserTaskContext from './../../UserTaskContext'

export default class MenuOptions extends React.Component{

    render(){
        return <UserTaskContext.Consumer>
            {({deallocateTask})=><View>
                <List style={{width: "100%"}}>
                    <ListItem>
                        <TouchableOpacity>
                            <Text> Edit List </Text>
                        </TouchableOpacity>
                    </ListItem>

                    <ListItem>
                        <TouchableOpacity onPress={()=>{
                            
                        }}>
                            <Text> Move All To Board </Text>
                        </TouchableOpacity>
                    </ListItem>

                    <ListItem>
                        <TouchableOpacity>
                            <Text> Clear Completed Items </Text>
                        </TouchableOpacity>
                    </ListItem>
                 </List>
            </View>
            }
            </UserTaskContext.Consumer>
    }
}

MenuOptions.propTypes = {
    // handlers
}