import React from 'react'

const EditModeContext = React.createContext({isEditMode: false, toggleEditMode: ()=>{}})

export default EditModeContext