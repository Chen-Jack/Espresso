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
var react_native_calendars_1 = require("react-native-calendars");
var react_native_1 = require("react-native");
var TravelingList_1 = require("../TravelingList");
var Day_1 = __importDefault(require("./Day"));
var TaskCalendar = /** @class */ (function (_super) {
    __extends(TaskCalendar, _super);
    function TaskCalendar(props) {
        var _this = _super.call(this, props) || this;
        _this.register_day_component = function (key, item) {
            _this.mounted_day_components[key] = item;
        };
        _this.unregister_day_component = function (key) {
            delete _this.mounted_day_components[key];
        };
        _this.check = function () {
            console.log(Object.keys(_this.mounted_day_components).length, _this.mounted_day_components);
        };
        _this.getList = function (coordinates) {
            var day_components = Object.values(_this.mounted_day_components);
            var isOnTop = false;
            for (var _i = 0, day_components_1 = day_components; _i < day_components_1.length; _i++) {
                var day = day_components_1[_i];
                isOnTop = day.isGestureOnTop(coordinates);
                if (isOnTop) {
                    return day;
                }
            }
        };
        _this.isGestureOnTop = function (coordinates) {
            var day_components = Object.values(_this.mounted_day_components);
            var isOnTop = false;
            for (var _i = 0, day_components_2 = day_components; _i < day_components_2.length; _i++) {
                var day = day_components_2[_i];
                isOnTop = day.isGestureOnTop(coordinates);
                if (isOnTop) {
                    return true;
                }
            }
            return false;
        };
        _this._generateCalendarMarkers = function () {
            var markers_list = {};
            for (var _i = 0, _a = _this.props.allocated_tasks; _i < _a.length; _i++) {
                var task_set = _a[_i];
                var date_iso_form = task_set.date;
                if (markers_list[date_iso_form] === undefined)
                    markers_list[date_iso_form] = { dots: [] };
                var isAllCompleted = false;
                for (var _b = 0, _c = task_set.tasks; _b < _c.length; _b++) {
                    var task = _c[_b];
                    if (!task.completed) {
                        break;
                    }
                    isAllCompleted = true;
                }
                for (var _d = 0, _e = task_set.tasks; _d < _e.length; _d++) {
                    var task = _e[_d];
                    if (isAllCompleted) {
                        markers_list[date_iso_form]["dots"].push({ key: task.task_id, color: "green" });
                    }
                    else {
                        if (task.completed)
                            markers_list[date_iso_form]["dots"].push({ key: task.task_id, color: "blue" });
                        else
                            markers_list[date_iso_form]["dots"].push({ key: task.task_id, color: "red" });
                    }
                }
            }
            return markers_list;
        };
        _this._updateMeasurements = function () {
            var day_components = Object.values(_this.mounted_day_components);
            for (var _i = 0, day_components_3 = day_components; _i < day_components_3.length; _i++) {
                var day = day_components_3[_i];
                day.updateMeasurement();
            }
        };
        _this._onMonthChange = function () {
            _this._updateMeasurements();
        };
        _this.mounted_day_components = {};
        return _this;
    }
    TaskCalendar.prototype.componentDidMount = function () {
        TravelingList_1.Embassy.registerLandable(this);
    };
    TaskCalendar.prototype.shouldComponentUpdate = function (nextProps) {
        if (this.props.allocated_tasks === nextProps.allocated_tasks)
            return false;
        else
            return true;
    };
    TaskCalendar.prototype.render = function () {
        var _this = this;
        return react_1.default.createElement(react_native_1.View, null,
            react_1.default.createElement(react_native_calendars_1.Calendar, { onMonthChange: this._onMonthChange, markingType: 'multi-dot', dayComponent: function (_a) {
                    var date = _a.date, marking = _a.marking, onLongPress = _a.onLongPress, onPress = _a.onPress, state = _a.state;
                    return (react_1.default.createElement(Day_1.default, { date_state: state, onPress: _this.props.onDayPress, markings: marking !== false ? marking : [], join: _this.register_day_component, leave: _this.unregister_day_component, date: date }));
                }, markedDates: this._generateCalendarMarkers() }));
    };
    return TaskCalendar;
}(react_1.default.Component));
exports.default = TaskCalendar;
