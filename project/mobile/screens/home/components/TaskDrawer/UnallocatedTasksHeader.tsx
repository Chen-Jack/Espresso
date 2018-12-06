import React from 'react'
import {View, Text} from 'react-native'

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

export default UnallocatedTasksHeader