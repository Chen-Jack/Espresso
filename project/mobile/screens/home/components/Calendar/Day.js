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
var react_native_1 = require("react-native");
var v4_1 = __importDefault(require("uuid/v4"));
var TravelingList_1 = require("./../TravelingList");
var Markings_1 = __importDefault(require("./Markings"));
var Day = /** @class */ (function (_super) {
    __extends(Day, _super);
    function Day(props) {
        var _this = _super.call(this, props) || this;
        _this.getDate = function () {
            return _this.props.date.dateString;
        };
        _this.onGestureLoseFocus = function () {
            console.log(_this.props.date.dateString, "lost focus!!!!");
            _this.setState({
                isGestureFocusing: false
            }, function () {
                console.log("Updated state to false");
            });
            TravelingList_1.Embassy.materializeTraveler();
        };
        _this.onGestureFocus = function () {
            console.log(_this.props.date.dateString, "gained focus!!!!");
            _this.setState({
                isGestureFocusing: true
            }, function () {
                console.log("UPdated state to true");
            });
            TravelingList_1.Embassy.ghostTraveler();
        };
        _this.onGestureStay = function () {
            console.log(_this.props.date.dateString, "stayed focus");
        };
        _this.onHandleReleaseGesture = function () {
            console.log(_this.props.date.dateString, "handled gesture");
        };
        _this.isGestureOnTop = function (coordinates) {
            if (!coordinates.x || !coordinates.y) {
                console.log("You forgot params");
                return false;
            }
            if (!_this.layout)
                return false;
            var x0 = _this.layout.x;
            var y0 = _this.layout.y;
            var x1 = _this.layout.x + _this.layout.width;
            var y1 = _this.layout.y + _this.layout.height;
            var isWithinX = (x0 < coordinates.x) && (coordinates.x < x1);
            var isWithinY = (y0 < coordinates.y) && (coordinates.y < y1);
            if (isWithinX && isWithinY) {
                return true;
            }
            else {
                return false;
            }
        };
        _this.updateMeasurement = function () {
            _this.wrapper && _this.wrapper.measure(function (x, y, width, height, pageX, pageY) {
                var layout = {
                    x: pageX,
                    y: pageY,
                    width: width,
                    height: height
                };
                _this.layout = layout;
            });
        };
        _this._onLayout = function () {
            // console.log("Initialiazing measurements for", this.props.date.dateString);
            _this.updateMeasurement();
        };
        _this.id = v4_1.default();
        _this.wrapper = null;
        _this.layout = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        _this.state = {
            isGestureFocusing: false
        };
        return _this;
    }
    Day.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (this.props === nextProps && this.state === nextState) {
            console.log("Dont update");
            return false;
        }
        else {
            console.log("YES UPDATE");
            return true;
        }
    };
    Day.prototype.componentDidMount = function () {
        this.props.join(this.id, this);
        console.log(this.props.date.month, this.props.date.day, "mounted");
    };
    Day.prototype.componentWillUnmount = function () {
        this.props.leave(this.id);
        console.log(this.props.date.month, this.props.date.day, "Unmounted");
    };
    Day.prototype.render = function () {
        var _this = this;
        console.log("Rendered");
        var textColor = { color: "rgba(0,0,0,0.75)" };
        if (this.props.date_state === "today")
            textColor.color = "purple";
        else if (this.props.date_state === "disabled")
            textColor.color = "rgba(0,0,0,0.3)";
        // const focusStyle = {backgroundColor: this.state.isGestureFocusing ? "red" : "white"}
        return react_1.default.createElement(react_native_1.View, { style: { flex: 1, justifyContent: "center", alignItems: "center" } },
            react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: function () { return _this.props.onPress(_this.props.date); }, style: [{ backgroundColor: this.state.isGestureFocusing ? "red" : "white", width: 25, height: 25, borderRadius: 100, justifyContent: "center", alignItems: "center" }] },
                react_1.default.createElement(react_native_1.View, { style: { width: "100%", justifyContent: "center", alignItems: "center" }, ref: function (ref) { return _this.wrapper = ref; }, onLayout: this._onLayout },
                    react_1.default.createElement(react_native_1.Text, { style: [{ width: "100%", textAlign: "center" }, textColor] },
                        " ",
                        this.props.date.day,
                        " "))),
            this.props.date_state !== "disabled" && react_1.default.createElement(Markings_1.default, { markings: this.props.markings }));
    };
    return Day;
}(react_1.default.Component));
exports.default = Day;
