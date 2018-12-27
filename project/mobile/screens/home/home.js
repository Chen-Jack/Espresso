"use strict";
//The home page for an account
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var native_base_1 = require("native-base");
var react_native_1 = require("react-native");
var Calendar_1 = require("./components/Calendar");
var TaskCarousel_1 = require("./components/TaskCarousel");
var TaskDrawer_1 = require("./components/TaskDrawer");
var Context_1 = require("./Context");
var immutability_helper_1 = __importDefault(require("immutability-helper"));
var TravelingList_1 = require("./components/TravelingList");
var Task_1 = __importDefault(require("./../../Task"));
var utility_1 = require("./../../utility");
console.disableYellowBox = true;
var HomeScreen = /** @class */ (function (_super) {
    __extends(HomeScreen, _super);
    function HomeScreen(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleEditMode = function (cb) {
            cb && cb(!_this.state.isEditMode);
            var deep_copy = Object.assign({}, _this.state.editContext);
            deep_copy.isEditMode = !_this.state.editContext.isEditMode;
            _this.setState({
                editContext: deep_copy
            }, function () {
                console.log("TOGGLED THE CONTEXT EDITMODE TO", _this.state.editContext.isEditMode);
                if (_this.state.editContext.isEditMode) {
                    _this.carousel.current.disableCarouselScroll();
                }
                else {
                    _this.carousel.current.enableCarouselScroll();
                }
            });
        };
        _this.updateCompletionStatusOfState = function (task_id, new_status, cb) {
            var _a, _b, _c;
            var original_allocated_state = _this.state.allocated_tasks;
            var original_unallocated_state = _this.state.unallocated_tasks;
            // First Search Through Allocated Tasks
            var found = false;
            for (var day_index in _this.state.allocated_tasks) {
                var day_tasks = _this.state.allocated_tasks[day_index].tasks;
                for (var task_index in day_tasks) {
                    if (day_tasks[task_index].task_id === task_id) {
                        var new_state = immutability_helper_1.default(_this.state.allocated_tasks, (_a = {},
                            _a[day_index] = {
                                tasks: (_b = {},
                                    _b[task_index] = {
                                        completed: { $set: new_status }
                                    },
                                    _b)
                            },
                            _a));
                        found = true;
                        _this.setState({
                            allocated_tasks: new_state
                        }, function () { return console.log("allocated state was set to", _this.state.allocated_tasks); });
                    }
                }
            }
            // Search through unallocated tasks if still haven't found
            if (!found) {
                for (var i in _this.state.unallocated_tasks) {
                    if (_this.state.unallocated_tasks[i].task_id === task_id) {
                        var new_state = immutability_helper_1.default(_this.state.unallocated_tasks, (_c = {},
                            _c[i] = {
                                completed: {
                                    $set: new_status
                                }
                            },
                            _c));
                        _this.setState({
                            unallocated_tasks: new_state
                        });
                    }
                }
            }
            Task_1.default.updateStatus(task_id, new_status, function (err) {
                if (err) {
                    _this.setState({
                        allocated_tasks: original_allocated_state,
                        unallocated_tasks: original_unallocated_state
                    });
                    cb && cb(err);
                }
                else {
                    cb && cb();
                }
            });
        };
        _this.allocateTask = function (task_id, new_date) {
            var _a;
            var original_allocated_state = _this.state.allocated_tasks;
            var original_unallocated_state = _this.state.unallocated_tasks;
            var original_task = {
                task_id: "",
                title: "",
                details: null,
                completed: false,
                allocated_date: null
            };
            var day_index_updated = null;
            var task_index_original = null;
            // Search through your state to know what indexes to update
            for (var task_index in _this.state.unallocated_tasks) {
                var task = _this.state.unallocated_tasks[task_index];
                if (task.task_id === task_id) {
                    original_task = Object.assign({}, task);
                    original_task.allocated_date = new_date;
                    task_index_original = Number(task_index);
                }
            }
            for (var day_index in _this.state.allocated_tasks) {
                var date = _this.state.allocated_tasks[day_index].date;
                if (date == new_date) {
                    day_index_updated = Number(day_index);
                    break;
                }
            }
            var new_unallocated_state = immutability_helper_1.default(_this.state.unallocated_tasks, {
                $splice: [[task_index_original, 1]]
            });
            var new_allocated_state = immutability_helper_1.default(_this.state.allocated_tasks, (_a = {},
                _a[day_index_updated] = {
                    tasks: {
                        $unshift: [original_task]
                    }
                },
                _a));
            _this.setState({
                unallocated_tasks: new_unallocated_state,
                allocated_tasks: new_allocated_state
            }, function () {
                native_base_1.Toast.show({
                    text: "Task was assigned to " + new_date,
                    buttonText: 'Ok'
                });
            });
            Task_1.default.allocateTask(task_id, new_date, function (err) {
                if (err) {
                    _this.setState({
                        unallocated_tasks: original_unallocated_state,
                        allocated_tasks: original_allocated_state
                    });
                }
            });
        };
        _this.deallocateAllTasksFromDate = function (target_date, cb) {
            var _a;
            console.log("deallocating all tasks on date", target_date);
            var original_allocated_state = _this.state.allocated_tasks;
            var original_unallocated_state = _this.state.unallocated_tasks;
            var deallocated_tasks = [];
            var original_date_index = null;
            // Search through your state to know what indexes to update
            for (var day_index in _this.state.allocated_tasks) {
                var date = _this.state.allocated_tasks[day_index].date;
                var day_tasks = _this.state.allocated_tasks[day_index].tasks;
                if (date === target_date) {
                    original_date_index = Number(day_index);
                    deallocated_tasks = (day_tasks.map(function (task) {
                        task.allocated_date = null;
                        return Object.assign({}, task);
                    }));
                }
            }
            var new_allocated_state = immutability_helper_1.default(_this.state.allocated_tasks, (_a = {},
                _a[original_date_index] = {
                    tasks: {
                        $set: []
                    }
                },
                _a));
            var new_unallocated_state = immutability_helper_1.default(_this.state.unallocated_tasks, {
                $push: deallocated_tasks
            });
            _this.setState({
                allocated_tasks: new_allocated_state,
                unallocated_tasks: new_unallocated_state
            }, function () {
                cb && cb();
                native_base_1.Toast.show({
                    text: 'All of your tasks were moved back to your board!',
                    buttonText: 'Got it'
                });
            });
            var task_id_arr = deallocated_tasks.map(function (task) { return task.task_id; });
            Task_1.default.allocateMultipleTasks(task_id_arr, null, function (err) {
                if (err) {
                    console.log("ERROR DEALLOCATING EVERYTHING");
                    _this.setState({
                        allocated_tasks: original_allocated_state,
                        unallocated_tasks: original_unallocated_state
                    });
                }
            });
        };
        _this.deallocateTask = function (task_id) {
            var _a;
            console.log("deallocating");
            var original_allocated_state = _this.state.allocated_tasks;
            var original_unallocated_state = _this.state.unallocated_tasks;
            var original_task;
            var day_index_original = -1;
            var task_index_original = -1;
            //Search through your state to know what indexes to update
            for (var day_index in _this.state.allocated_tasks) {
                var day_tasks = _this.state.allocated_tasks[day_index].tasks;
                for (var task_index in day_tasks) {
                    if (day_tasks[task_index].task_id === task_id) {
                        var original_task = Object.assign({}, day_tasks[task_index]);
                        day_index_original = Number(day_index);
                        task_index_original = Number(task_index);
                    }
                }
            }
            var new_allocated_state = immutability_helper_1.default(_this.state.allocated_tasks, (_a = {},
                _a[day_index_original] = {
                    tasks: {
                        $splice: [[task_index_original, 1]]
                    }
                },
                _a));
            var new_unallocated_state = immutability_helper_1.default(_this.state.unallocated_tasks, {
                $push: [original_task]
            });
            _this.setState({
                allocated_tasks: new_allocated_state,
                unallocated_tasks: new_unallocated_state
            }, function () {
                native_base_1.Toast.show({
                    text: 'Task was moved back to your board!',
                    buttonText: 'Got it'
                });
            });
            Task_1.default.allocateTask(task_id, null, function (err) {
                if (err) {
                    _this.setState({
                        allocated_tasks: original_allocated_state,
                        unallocated_tasks: original_unallocated_state
                    });
                }
            });
        };
        _this.reallocateTask = function (task_id, new_date) {
            var _a, _b;
            console.log("Reallocated", task_id, new_date);
            // Keep original_state incase of failed API call
            var original_state = _this.state.allocated_tasks;
            console.log("Origina state is", original_state);
            var original_task;
            var day_index_original = null;
            var task_index_original = null;
            var day_index_updated = null;
            // Gather variables to know what to mutate
            for (var day_index in _this.state.allocated_tasks) {
                var day_tasks = _this.state.allocated_tasks[day_index].tasks;
                console.log("no its not that");
                var date = _this.state.allocated_tasks[day_index].date;
                if (date === new_date) {
                    day_index_updated = Number(day_index);
                }
                for (var task_index in day_tasks) {
                    if (day_tasks[task_index].task_id === task_id) {
                        original_task = Object.assign({}, day_tasks[task_index]);
                        day_index_original = Number(day_index);
                        task_index_original = Number(task_index);
                    }
                }
            }
            console.log("Day_index_updated", day_index_updated);
            console.log("Day index original", day_index_original);
            console.log("Task_index_original", task_index_original);
            var updated_task = immutability_helper_1.default(original_task, { allocated_date: { $set: new_date } });
            var new_state = immutability_helper_1.default(_this.state.allocated_tasks, (_a = {},
                // Remove Item from Old Date state
                _a[day_index_original] = {
                    tasks: {
                        $splice: [[task_index_original, 1]]
                    }
                },
                _a));
            if (day_index_updated !== null) {
                //Add Item To New Date, but only
                // if the date is within our state. otherwise, theres no need
                // to add it to our state
                new_state = immutability_helper_1.default(new_state, (_b = {},
                    _b[day_index_updated] = {
                        tasks: {
                            $unshift: [updated_task]
                        }
                    },
                    _b));
            }
            _this.setState({
                allocated_tasks: new_state
            });
            Task_1.default.allocateTask(task_id, new_date, function (err) {
                if (err) {
                    _this.setState({
                        allocated_tasks: original_state
                    }, function () {
                        console.log("Error with updating task date", err);
                        // Alert.alert("Error with api call")
                    });
                }
            });
        };
        _this.createTask = function (title, details, cb) {
            // Keep original_state incase of failed API call
            var original_state = _this.state.unallocated_tasks;
            Task_1.default.createTask(title, details, function (err, new_task) {
                if (err) {
                    _this.setState({
                        unallocated_tasks: original_state,
                    }, function () {
                        cb(err);
                    });
                }
                else {
                    var new_state = immutability_helper_1.default(_this.state.unallocated_tasks, {
                        $unshift: [new_task]
                    });
                    _this.setState({
                        unallocated_tasks: new_state
                    }, cb);
                }
            });
        };
        _this.deleteTask = function (task_id) {
            var _a;
            console.log("DELETING", task_id);
            var original_allocated_state = _this.state.allocated_tasks;
            var original_unallocated_state = _this.state.unallocated_tasks;
            var day_index_original = null;
            var task_index_original = null;
            // Search through allocated tasks
            for (var day_index in _this.state.allocated_tasks) {
                var day_tasks = _this.state.allocated_tasks[day_index].tasks;
                for (var task_index in day_tasks) {
                    if (day_tasks[task_index].task_id === task_id) {
                        day_index_original = Number(day_index);
                        task_index_original = Number(task_index);
                        var new_state = immutability_helper_1.default(_this.state.allocated_tasks, (_a = {},
                            _a[day_index_original] = {
                                tasks: {
                                    $splice: [[task_index_original, 1]]
                                }
                            },
                            _a));
                        _this.setState({
                            allocated_tasks: new_state
                        });
                        break;
                    }
                }
                if (task_index_original !== null && day_index_original !== null) {
                    break;
                }
            }
            //Search through unallocated tasks if still not found
            if (task_index_original === null && task_index_original === null) {
                for (var _i = 0, _b = _this.state.unallocated_tasks; _i < _b.length; _i++) {
                    var task = _b[_i];
                    if (task.task_id === task_id) {
                        var new_state = immutability_helper_1.default(_this.state.unallocated_tasks, {
                            $splice: [[task_index_original, 1]]
                        });
                        _this.setState({
                            unallocated_tasks: new_state
                        });
                    }
                }
            }
            Task_1.default.deleteTask(task_id, function (err) {
                if (err) {
                    _this.setState({
                        unallocated_tasks: original_unallocated_state,
                        allocated_tasks: original_allocated_state
                    });
                }
                else {
                    native_base_1.Toast.show({
                        text: "Task was deleted",
                        buttonText: 'Ok'
                    });
                }
            });
        };
        _this.editTask = function (task_id, new_title, new_details, cb) {
            var _a, _b, _c;
            console.log("Editing Task to", new_title, new_details);
            var original_allocated_state = _this.state.allocated_tasks;
            var original_unallocated_state = _this.state.unallocated_tasks;
            var day_index_original = null;
            var task_index_original = null;
            //Search through allocated tasks
            for (var day_index in _this.state.allocated_tasks) {
                var day_tasks = _this.state.allocated_tasks[day_index].tasks;
                for (var task_index in day_tasks) {
                    if (day_tasks[task_index].task_id === task_id) {
                        day_index_original = Number(day_index);
                        task_index_original = Number(task_index);
                        var new_state = immutability_helper_1.default(_this.state.allocated_tasks, (_a = {},
                            _a[day_index_original] = {
                                tasks: (_b = {},
                                    _b[task_index_original] = {
                                        title: { $set: new_title },
                                        details: { $set: new_details }
                                    },
                                    _b)
                            },
                            _a));
                        _this.setState({
                            allocated_tasks: new_state
                        }, cb);
                        break;
                    }
                }
                if (task_index_original !== null && day_index_original !== null) {
                    break;
                }
            }
            //Search through unallocated tasks if still not found
            if (task_index_original === null && task_index_original === null) {
                for (var task_index in _this.state.unallocated_tasks) {
                    var task = _this.state.unallocated_tasks[task_index];
                    if (task.task_id === task_id) {
                        var new_state = immutability_helper_1.default(_this.state.unallocated_tasks, (_c = {},
                            _c[task_index] = {
                                title: { $set: new_title },
                                details: { $set: new_details }
                            },
                            _c));
                        _this.setState({
                            unallocated_tasks: new_state
                        }, cb);
                    }
                }
            }
            Task_1.default.editTask(task_id, new_title, new_details, function (err) {
                if (err) {
                    _this.setState({
                        unallocated_tasks: original_unallocated_state,
                        allocated_tasks: original_allocated_state
                    });
                }
                else {
                    native_base_1.Toast.show({
                        text: "Updated your task",
                        buttonText: 'Ok'
                    });
                }
            });
        };
        _this._onDateSelection = function (isodate) {
            _this.setState({
                selected_date: isodate
            }, function () {
                _this.carousel.current.updateToDate(_this.state.selected_date);
            });
        };
        _this._generateEmptyTaskSet = function () {
            var day_variance = 75; //How many days of tasks you will show.
            var seconds_per_day = 86400;
            var task_set = [];
            var past_days_allowed = 30; //How far back in time do you want to see
            var starting_date_in_epoch = Math.floor((new Date).getTime() - (seconds_per_day * past_days_allowed * 1000));
            for (var i = 0; i < day_variance; i++) {
                //Convert from seconds back into miliseconds for date constructor
                var date = new Date((starting_date_in_epoch + (i * seconds_per_day * 1000)));
                task_set.push({
                    date: date.toISOString().substring(0, 10),
                    tasks: []
                });
            }
            console.log(task_set);
            return (task_set);
        };
        _this._populateTaskSet = function (tasks) {
            var unallocated_tasks = [];
            var allocated_tasks = _this._generateEmptyTaskSet();
            for (var task_id in tasks) {
                var task = tasks[task_id];
                if (task.allocated_date === null) {
                    unallocated_tasks.push(task);
                }
                else {
                    for (var _i = 0, allocated_tasks_1 = allocated_tasks; _i < allocated_tasks_1.length; _i++) {
                        var date_entry = allocated_tasks_1[_i];
                        if (date_entry.date === task.allocated_date) {
                            date_entry.tasks.push(task);
                            break;
                        }
                    }
                }
            }
            _this.setState({
                unallocated_tasks: unallocated_tasks,
                allocated_tasks: allocated_tasks,
                isLoading: false
            });
        };
        _this._initalizeApp = function () {
            console.log("INITALIZING APP");
            react_native_1.AsyncStorage.getItem("espresso_app", function (err, app) {
                if (err) {
                    console.log("ERROR INITIALIZING. PROBLEM GETTING SAVE DATA");
                    // return Alert.alert("PROBLEM INITIALIZING ESPRESSO")
                    _this.setState({
                        isLoading: false,
                        unallocated_tasks: [],
                        allocated_tasks: []
                    });
                }
                else {
                    console.log("NO PROBLEMS GETTING KEY");
                    var app_data = JSON.parse(app);
                    if (!app_data) {
                        console.log("Initializing App for the first time");
                        var intial_app_state = {
                            tasks: {}
                        };
                        react_native_1.AsyncStorage.setItem("espresso_app", JSON.stringify(intial_app_state), function (err) {
                            if (err) {
                                console.log("Error, initializing first time");
                                return react_native_1.Alert.alert("PROBLEM INITIALIZING ESPRESSO");
                            }
                            else {
                                _this.setState({
                                    allocated_tasks: _this._generateEmptyTaskSet(),
                                    isLoading: false
                                });
                            }
                        });
                    }
                    else {
                        console.log("EVERYTHING IS OKAY", "Receieved", app_data.tasks);
                        var tasks = app_data.tasks;
                        _this._populateTaskSet(tasks);
                    }
                }
            });
        };
        _this._promptTaskCreation = function () {
            _this.setState({ promptTaskCreation: true });
        };
        _this._openDrawer = function () {
            _this.drawer.openDrawer();
        };
        _this.state = {
            isLoading: true,
            unallocated_tasks: [],
            allocated_tasks: [],
            selected_date: new Date().toISOString().substring(0, 10),
            promptTaskCreation: false,
            isEditMode: false,
            editContext: {
                isEditMode: false,
                toggleEditMode: _this.toggleEditMode
            }
        };
        _this.carousel = react_1.default.createRef();
        _this.drawer = null;
        _this.today = new Date();
        _this.manager = {
            updateStatus: _this.updateCompletionStatusOfState,
            reallocateTask: _this.reallocateTask,
            deallocateTask: _this.deallocateTask,
            allocateTask: _this.allocateTask,
            createTask: _this.createTask,
            deleteTask: _this.deleteTask,
            editTask: _this.editTask,
            deallocateTasksFromDate: _this.deallocateAllTasksFromDate
        };
        //Give the Embassy access to the same context manager
        TravelingList_1.Embassy.setManager(_this.manager);
        return _this;
    }
    HomeScreen.prototype.componentDidMount = function () {
        console.log("MOUNTED LETS GO @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        this._initalizeApp();
    };
    HomeScreen.prototype.render = function () {
        var _this = this;
        return react_1.default.createElement(Context_1.UserTaskContext.Provider, { value: this.manager },
            react_1.default.createElement(Context_1.EditModeContext.Provider, { value: this.state.editContext },
                react_1.default.createElement(TaskDrawer_1.TaskDrawer, { ref: function (ref) { _this.drawer = ref; }, unallocated_tasks: this.state.unallocated_tasks },
                    react_1.default.createElement(native_base_1.Container, { style: { overflow: "hidden", height: react_native_1.Dimensions.get('window').height, flexDirection: "column" } },
                        react_1.default.createElement(native_base_1.Header, { style: { backgroundColor: '#222' } },
                            react_1.default.createElement(native_base_1.Body, { style: { justifyContent: "center" } },
                                react_1.default.createElement(native_base_1.Title, { style: { position: "absolute", left: 10, color: "#fff" } }, utility_1.getDay(this.today) + " | " + this.today.toLocaleDateString()),
                                react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: function () { return _this.props.navigation.navigate("settings"); }, style: { position: "absolute", right: 10 } },
                                    react_1.default.createElement(native_base_1.Icon, { style: { color: "white" }, name: "settings" })))),
                        react_1.default.createElement(native_base_1.Content, { style: { height: react_native_1.Dimensions.get('window').height, width: react_native_1.Dimensions.get('window').width, backgroundColor: "#fff" }, scrollEnabled: false },
                            react_1.default.createElement(react_native_1.View, { style: { paddingBottom: 50, height: react_native_1.Dimensions.get('window').height, width: react_native_1.Dimensions.get('window').width } },
                                react_1.default.createElement(Calendar_1.TaskCalendar, { onDayPress: function (day) {
                                        _this._onDateSelection(day.dateString);
                                    }, allocated_tasks: this.state.allocated_tasks }),
                                react_1.default.createElement(TaskCarousel_1.TaskCarousel, { ref: this.carousel, isLoading: this.state.isLoading, selected_date: this.state.selected_date, handleDateSelection: this._onDateSelection, task_data: this.state.allocated_tasks }))),
                        react_1.default.createElement(native_base_1.Footer, { style: { backgroundColor: "#222", width: react_native_1.Dimensions.get('window').width, height: 50, padding: 0, margin: 0 } },
                            react_1.default.createElement(native_base_1.FooterTab, { style: { padding: 0, margin: 0, flexDirection: "row", width: "100%", justifyContent: "center" } },
                                react_1.default.createElement(native_base_1.Button, { style: { justifyContent: "center", alignItems: "center", borderRadius: 100 }, onPress: this._openDrawer },
                                    react_1.default.createElement(native_base_1.Icon, { style: { color: "white" }, type: "Entypo", name: "blackboard" }))))))));
    };
    HomeScreen.navigationOptions = {
        header: null,
        gesturesEnabled: false,
    };
    return HomeScreen;
}(react_1.default.Component));
exports.default = HomeScreen;
