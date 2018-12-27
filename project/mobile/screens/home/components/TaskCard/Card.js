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
var native_base_1 = require("native-base");
var TravelingList_1 = require("./../TravelingList");
var Context_1 = require("../../Context");
var react_native_collapsible_1 = __importDefault(require("react-native-collapsible"));
var CardOptions_1 = __importDefault(require("./CardOptions"));
var react_native_1 = require("react-native");
var TaskCard = /** @class */ (function (_super) {
    __extends(TaskCard, _super);
    function TaskCard(props) {
        var _this = _super.call(this, props) || this;
        _this.ghost = function () {
            react_native_1.Animated.timing(_this.state.opacity, {
                toValue: 0.6,
                duration: 200
            }).start();
        };
        _this.materialize = function () {
            react_native_1.Animated.timing(_this.state.opacity, {
                toValue: 1,
                duration: 400
            }).start();
        };
        _this.getID = function () {
            return _this.props.task.task_id;
        };
        _this.getDate = function () {
            return _this.props.task.allocated_date;
        };
        _this.toggleCard = function () {
            _this.setState({
                isCollapsed: !_this.state.isCollapsed
            });
        };
        _this.state = {
            isCollapsed: true,
            opacity: new react_native_1.Animated.Value(1)
        };
        return _this;
    }
    TaskCard.prototype.componentDidMount = function () {
        console.log("Card Mounting");
    };
    TaskCard.prototype.componentWillUnmount = function () {
        console.log("TaskCard Unmounting");
    };
    TaskCard.prototype.render = function () {
        var _this = this;
        var strike_through_style = { textDecorationLine: 'line-through', textDecorationStyle: 'solid' };
        return (react_1.default.createElement(Context_1.EditModeContext.Consumer, null, function (_a) {
            var isEditMode = _a.isEditMode;
            return react_1.default.createElement(Context_1.UserTaskContext.Consumer, null, function (_a) {
                var updateStatus = _a.updateStatus;
                // console.log("The card is in edit mode? ", isEditMode);
                return react_1.default.createElement(TravelingList_1.Draggable, { origin_list: _this.props.parent_list, source: _this, doubleTapHandler: function () { updateStatus(_this.props.task.task_id, !_this.props.task.completed); } },
                    react_1.default.createElement(react_native_1.Animated.View, { style: { opacity: _this.state.opacity } },
                        react_1.default.createElement(native_base_1.Card, null,
                            react_1.default.createElement(native_base_1.CardItem, { bordered: true },
                                react_1.default.createElement(native_base_1.View, { style: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" } },
                                    react_1.default.createElement(native_base_1.Text, { style: [{ width: "80%" }, _this.props.task.completed && strike_through_style] }, _this.props.task.title || "Task"),
                                    react_1.default.createElement(CardOptions_1.default, { style: { width: "20%" }, task: _this.props.task, toggleDetails: _this.toggleCard, isCollapsed: _this.state.isCollapsed, details: _this.props.task.details, isEditMode: isEditMode }))),
                            react_1.default.createElement(react_native_collapsible_1.default, { collapsed: _this.state.isCollapsed },
                                react_1.default.createElement(native_base_1.CardItem, { style: { backgroundColor: "#eee" } },
                                    react_1.default.createElement(native_base_1.Body, null,
                                        react_1.default.createElement(native_base_1.Text, null, _this.props.task.details || "")))))));
            });
        }));
    };
    return TaskCard;
}(react_1.default.Component));
exports.default = TaskCard;
