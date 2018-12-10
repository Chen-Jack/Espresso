import React from 'react'
import PropTypes from 'prop-types'
import { TaskList } from './../TaskList'
import { View, Text, Dimensions, TextInput } from 'react-native'
import { Icon, Button, Thumbnail, Image } from 'native-base'
import { TaskCreationPrompt } from './../TaskForm'
import { Focusable } from './../TravelingList'
import { Taskable } from './../../../../Task'
import { Layout } from './../../../../utility'
import FilterBar from './FilterBar'
import UnallocatedTasksHeader from './UnallocatedTasksHeader'
import DrawerHeader from './DrawerHeader'

interface ContentState {
    filter_text: string
}

interface ContentProps {
    task_data: Taskable[]
}

export default class DrawerContent extends React.Component<ContentProps, ContentState>{
    list: React.RefObject<any>
    inner_list : React.RefObject<TaskList>
    form: TaskCreationPrompt | null

    constructor(props: ContentProps) {
        super(props)

        this.state = {
            filter_text: ""
        }


        this.list = React.createRef()
        this.inner_list = React.createRef()
        this.form = null
    }

    componentWillUnmount() {
        console.log("Drawer Content unmounting");
    }

    measureLayout = (cb?: (layout: Layout) => void) => {
        this.list.current && this.list.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            const layout = {
                x: pageX,
                y: pageY,
                width: width,
                height: height
            }
            cb && cb(layout);
        })
    }

    _onFilterBarChangeText = (new_text: string) => {
        console.log("changing text to", new_text);
        this.setState({
            filter_text: new_text
        })
    }

    filterTaskList = (task_list : Taskable[]) => {
        return task_list.filter((task : Taskable) => {
            if (task.title.includes(this.state.filter_text))
                return true
            else
                return false
        })
    }

    togglePrompt = () => {
        this.form && this.form.togglePrompt()
    }

    getInnerList = () => {
        return this.inner_list.current as Focusable | null
    }

    render() {
        return (
            <View style={{ backgroundColor: "#ddd", height: Dimensions.get('window').height, width: "100%" }}>

                <DrawerHeader />
                <FilterBar onChangeText={this._onFilterBarChangeText} />

                <View
                    ref={this.list}
                    style={{ padding: 5, flex: 1 }}>

                    <UnallocatedTasksHeader task_list={this.props.task_data} />
                    <TaskList
                        ref={this.inner_list}
                        data={{
                            date: null,
                            tasks: this.filterTaskList(this.props.task_data)
                        }}
                    />
                </View>

                <View style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}>
                    <TaskCreationPrompt ref={(ref => { this.form = ref })} />
                    <Button style={{ borderRadius: 100, marginVertical: 10, backgroundColor: "#222" }} onPress={this.togglePrompt}>
                        <Icon name='add' />
                    </Button>
                </View>

            </View>
        )
    }
}
