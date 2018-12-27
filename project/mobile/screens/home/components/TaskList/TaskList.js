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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var TaskCard_1 = require("./../TaskCard");
var TaskListHeader_1 = __importDefault(require("./TaskListHeader"));
var EmptyList_1 = __importDefault(require("./EmptyList"));
var TaskList = /** @class */ (function (_super) {
    __extends(TaskList, _super);
    // layout: any
    function TaskList(props) {
        var _this = _super.call(this, props) || this;
        _this._renderListItem = function (_a) {
            var item = _a.item, index = _a.index;
            // console.log("CARD IS RENDERING, task");
            return (react_1.default.createElement(TaskCard_1.TaskCard
            // parent_list={this}
            , { 
                // parent_list={this}
                task: item, index: index }));
        };
        _this._onEnterHandler = function () {
            console.log("setting");
            _this.setState({
                isGestureHovering: true
            });
        };
        _this._onLeaveHandler = function () {
            console.log("unsetting");
            _this.setState({
                isGestureHovering: false
            });
        };
        _this.measureLayout = function (cb) {
            if (cb === void 0) { cb = function () { }; }
            _this.list.current.measure(function (x, y, width, height, pageX, pageY) {
                var layout = {
                    x: pageX,
                    y: pageY,
                    width: width,
                    height: height
                };
                // this.layout = layout
                cb(layout);
            });
        };
        _this.getDate = function () {
            return _this.props.date || null;
        };
        _this.toggleScroll = function (status) {
            _this.setState({
                canScroll: (status !== undefined) ? status : !_this.state.canScroll
            });
        };
        _this.onGestureStay = function () {
            console.log(_this.props.date + " still focused");
        };
        _this.onGestureFocus = function () {
            console.log(_this.props.date + " is focused");
            // this._onEnterHandler()
        };
        _this.onGestureLoseFocus = function () {
            console.log(_this.props.date + " lost focus");
            // this._onLeaveHandler()
        };
        _this.onHandleReleaseGesture = function () {
            console.log(_this.props.date + " captured the released gesture");
        };
        _this.onLayoutHandler = function () {
            if (_this.props.initialize) {
                _this.measureLayout(function (layout) {
                    if (_this.props.initialize) {
                        _this.props.initialize(_this, layout, _this.props.index);
                    }
                });
            }
        };
        _this.list = react_1.default.createRef();
        // this.layout = null
        _this.state = {
            isGestureHovering: false,
            canScroll: true,
        };
        return _this;
    }
    TaskList.prototype.componentWillUnmount = function () {
        console.log("TaskList unmounting");
    };
    TaskList.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        console.log(this.props, nextProps);
        console.log(this.state, nextState);
        if (this.props === nextProps && this.state == nextState) {
            console.log("Yep");
            return false;
        }
        else {
            console.log("Nope");
            return true;
        }
    };
    TaskList.prototype.render = function () {
        console.log("Tasklist is rendering");
        var focus_style = { backgroundColor: (this.state.isGestureHovering ? "yellow" : null) };
        var landable_style = __assign({ flex: 1 }, focus_style, { width: "100%", height: "100%" });
        return (react_1.default.createElement(react_native_1.View, { onLayout: this.onLayoutHandler, ref: this.list, style: { flex: 1, overflow: "hidden" } },
            (this.props.date !== null) &&
                react_1.default.createElement(TaskListHeader_1.default, { task_list: this.props.tasks, date: this.props.date }),
            this.props.tasks.length === 0 ?
                react_1.default.createElement(EmptyList_1.default, null) :
                react_1.default.createElement(react_native_1.View, { style: { width: "100%", height: "100%" } },
                    react_1.default.createElement(react_native_1.FlatList, { keyExtractor: function (item, index) { return item.task_id; }, scrollEnabled: this.state.canScroll, data: this.props.tasks, renderItem: this._renderListItem, style: landable_style }))));
    };
    return TaskList;
}(react_1.default.Component));
exports.default = TaskList;
