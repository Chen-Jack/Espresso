"use strict";
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
var TaskList_1 = require("./../TaskList");
var react_native_1 = require("react-native");
var native_base_1 = require("native-base");
var TaskForm_1 = require("./../TaskForm");
var FilterBar_1 = __importDefault(require("./FilterBar"));
var UnallocatedTasksHeader_1 = __importDefault(require("./UnallocatedTasksHeader"));
var DrawerHeader_1 = __importDefault(require("./DrawerHeader"));
var DrawerContent = /** @class */ (function (_super) {
    __extends(DrawerContent, _super);
    function DrawerContent(props) {
        var _this = _super.call(this, props) || this;
        _this.measureLayout = function (cb) {
            _this.list.current && _this.list.current.measure(function (x, y, width, height, pageX, pageY) {
                var layout = {
                    x: pageX,
                    y: pageY,
                    width: width,
                    height: height
                };
                cb && cb(layout);
            });
        };
        _this._onFilterBarChangeText = function (new_text) {
            console.log("changing text to", new_text);
            _this.setState({
                filter_text: new_text
            });
        };
        _this.filterTaskList = function (task_list) {
            return task_list.filter(function (task) {
                if (task.title.includes(_this.state.filter_text))
                    return true;
                else
                    return false;
            });
        };
        _this.togglePrompt = function () {
            _this.form && _this.form.togglePrompt();
        };
        _this.getInnerList = function () {
            return _this.inner_list.current;
        };
        _this.state = {
            filter_text: ""
        };
        _this.list = react_1.default.createRef();
        _this.inner_list = react_1.default.createRef();
        _this.form = null;
        return _this;
    }
    DrawerContent.prototype.componentWillUnmount = function () {
        console.log("Drawer Content unmounting");
    };
    DrawerContent.prototype.render = function () {
        var _this = this;
        console.log("WAIT, ITS", this.props.task_data);
        return (react_1.default.createElement(react_native_1.View, { style: { backgroundColor: "#eee", height: react_native_1.Dimensions.get('window').height, width: "100%" } },
            react_1.default.createElement(DrawerHeader_1.default, null),
            react_1.default.createElement(FilterBar_1.default, { onChangeText: this._onFilterBarChangeText }),
            react_1.default.createElement(react_native_1.View, { ref: this.list, style: { padding: 5, flex: 1 } },
                react_1.default.createElement(UnallocatedTasksHeader_1.default, { task_list: this.props.task_data }),
                react_1.default.createElement(TaskList_1.TaskList, { ref: this.inner_list, date: null, tasks: this.filterTaskList(this.props.task_data) })),
            react_1.default.createElement(react_native_1.View, { style: { width: "100%", flexDirection: "row", justifyContent: "center" } },
                react_1.default.createElement(TaskForm_1.TaskCreationPrompt, { ref: (function (ref) { _this.form = ref; }) }),
                react_1.default.createElement(native_base_1.Button, { style: { borderRadius: 100, marginVertical: 10, backgroundColor: "#222" }, onPress: this.togglePrompt },
                    react_1.default.createElement(native_base_1.Icon, { name: 'add' })))));
    };
    return DrawerContent;
}(react_1.default.Component));
exports.default = DrawerContent;
