/*
    Context Operator to update the user's task data
*/
import React from 'react'

const UserTaskContext = React.createContext();

class UserTaskProvider extends React.Component{


    render(){
        return <UserTaskContext.Provider value={}>
            {this.props.children}
        </UserTaskContext.Provider>
    }
}


export default UserTaskProvider


