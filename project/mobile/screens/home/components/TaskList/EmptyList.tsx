import React from 'react'
import { View, Text, FlatList } from 'react-native'
import {TaskCard} from './../TaskCard'
import { PopupMenu } from './../PopupMenu'
import { Button, Icon, Badge } from 'native-base';

const EmptyList = () => {
    return <View style={{ opacity: 0.4, flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
        <Icon type="Entypo" name="document" />
        <Text style={{ justifyContent: "center", alignItems: "center", fontSize: 20 }}>
            Looks Empty...
        </Text>
    </View>
}

export default EmptyList