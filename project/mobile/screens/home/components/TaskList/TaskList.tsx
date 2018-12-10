import React from 'react'
import { View, FlatList } from 'react-native'
import { TaskCard } from './../TaskCard'
import TaskListHeader from './TaskListHeader'
import EmptyList from './EmptyList'
import { Focusable, Transferable } from '../TravelingList';
import { Layout } from './../../../../utility'
import { Taskable, TaskSet } from './../../../../Task'

interface TaskListProps {
    // Initialize is a callback that TaskList will call if it possesses the starting index
    // This is used to initize the layout of the initial task list.
    initialize ?: any | null
    data: TaskSet,
    index ?: number
}
interface TaskListState {
    isGestureHovering: boolean,
    canScroll: boolean
}

export default class TaskList extends React.Component<TaskListProps, TaskListState> implements Focusable, Transferable{
    list: React.RefObject<any>
    layout: any

    constructor(props: TaskListProps) {
        super(props)

        this.list = React.createRef()
        this.layout = null

        this.state = {
            isGestureHovering: false,
            canScroll: true,
        }

    }

    componentWillUnmount() {
        console.log("TaskList unmounting");
    }

    _renderListItem = ({ item, index }: { item: Taskable, index: number }) => {
        return (
            <TaskCard
                parent_list={this}
                task={item}
                index={index} />
        )
    }

    _onEnterHandler = () => {
        console.log("setting");
        this.setState({
            isGestureHovering: true
        })
    }

    _onLeaveHandler = () => {
        console.log("unsetting");
        this.setState({
            isGestureHovering: false
        })
    }

    measureLayout = (cb: any = () => { }) => {
        this.list.current.measure((x : number, y:number, width: number, height: number, pageX: number, pageY: number) => {
            const layout = {
                x: pageX,
                y: pageY,
                width: width,
                height: height
            }
            this.layout = layout
            cb(layout)
        })
    }


    getDate = () => {
        return this.props.data.date || null
    }

    toggleScroll = (status: boolean | undefined) => {
        this.setState({
            canScroll: (status !== undefined) ? status : !this.state.canScroll
        })
    }

    onGestureStay = () => {
        console.log(`${this.props.data.date} still focused`);
    }

    onGestureFocus = () => {
        console.log(`${this.props.data.date} is focused`);
        // this._onEnterHandler()
    }

    onGestureLoseFocus = () => {
        console.log(`${this.props.data.date} lost focus`);
        // this._onLeaveHandler()
    }

    onHandleReleaseGesture = () => {
        console.log(`${this.props.data.date} captured the released gesture`);
    }


    onLayoutHandler = () => {
        if (this.props.initialize) {
            this.measureLayout((layout: Layout) => {
                if (this.props.initialize) {
                    this.props.initialize(this, layout, this.props.index)
                }
            })
        }
    }

    render() {
        let focus_style = { backgroundColor: (this.state.isGestureHovering ? "yellow" : null) }
        let landable_style = { flex: 1, ...focus_style, width: "100%", height: "100%" }
        return (<View
            onLayout={this.onLayoutHandler}
            ref={this.list}
            style={{ flex: 1 }}>

            {/* TASK LIST HEADER */}
            {(this.props.data.date !== null) &&
                <TaskListHeader
                    task_list={this.props.data.tasks}
                    date={this.props.data.date} />
            }


            {/* TASK LIST BODY  */}
            {this.props.data.tasks.length === 0 ?
                <EmptyList /> :
                <View style={{ width: "100%", height: "100%" }}>
                    <FlatList
                        scrollEnabled={this.state.canScroll}
                        index={this.props.index}
                        data={this.props.data.tasks}
                        renderItem={this._renderListItem}
                        style={landable_style} />
                </View>
            }
        </View>)

    }
}
