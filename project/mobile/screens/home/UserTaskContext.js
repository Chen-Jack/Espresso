/*
    Context Operator to update the user's task data
*/
import React from 'react'
import PropTypes from 'prop-types'

const UserTaskContext = React.createContext({});

class UserTaskProvider extends React.Component{
    render(){
        return <UserTaskContext.Provider value={this.props.value}>
            {this.props.children}
        </UserTaskContext.Provider>
    }
}

// class UserTaskConsumer extends React.Component{
//     /*
//     Binds the context into a prop for the children
//     */
   
//     render(){
//         return <UserTaskContext.Consumer>
//             { (context)=>{
//                 const childWithProp = React.Children.map(this.props.children, (child) => {
//                     return React.cloneElement(child, {task_context: context});
//                 });
//                 return <View style={{backgroundColor:"red"}}>
//                     {childWithProp}
//                 </View>
//             } }
//         </UserTaskContext.Consumer>
//     }
// }

UserTaskProvider.propTypes = {
    value : PropTypes.object.isRequired
}
export default UserTaskContext
export {UserTaskProvider}

