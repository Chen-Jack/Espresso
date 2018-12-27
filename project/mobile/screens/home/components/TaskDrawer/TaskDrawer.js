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
var react_native_side_menu_1 = __importDefault(require("react-native-side-menu"));
var Content_1 = __importDefault(require("./Content"));
var TravelingList_1 = require("./../TravelingList");
var TaskDrawer = /** @class */ (function (_super) {
    __extends(TaskDrawer, _super);
    function TaskDrawer(props) {
        var _this = _super.call(this, props) || this;
        _this.getList = function () {
            return _this.content && _this.content.getInnerList();
        };
        _this.getLayout = function () {
            if (_this.state.visible && _this.open_layout)
                return _this.open_layout;
            else if (!_this.state.visible && _this.close_layout)
                return _this.close_layout;
            return { x: 0, y: 0, width: 0, height: 0 };
        };
        _this.isGestureOnTop = function (location) {
            /*
            Checks if the given coordinates are ontop of the focused landable
            */
            if (!location.x || !location.y) {
                console.log("You forgot params");
                return false;
            }
            var layout = _this.state.visible ? _this.open_layout : _this.close_layout;
            if (!layout)
                return false;
            else {
                var x0 = layout.x;
                var y0 = layout.y;
                var x1 = layout.x + layout.width;
                var y1 = layout.y + layout.height;
                var isWithinX = (x0 < location.x) && (location.x < x1);
                var isWithinY = (y0 < location.y) && (location.y < y1);
                if (isWithinX && isWithinY) {
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        _this.onCardPickedUp = function () {
            _this.setState({
                visible: false,
                gestureInProgress: true
            });
        };
        _this.onCardReleased = function () {
            _this.setState({
                visible: true,
                gestureInProgress: false
            });
        };
        _this._onDrawerOpen = function () {
            _this.setState({
                visible: true
            });
            TravelingList_1.Embassy.registerLandable(_this);
            console.log("Opened drawer");
            if (!_this.state.registered_events) {
                _this.setState({
                    registered_events: true
                }, function () {
                    TravelingList_1.Embassy.addOnStartHandlers(_this.onCardPickedUp);
                    TravelingList_1.Embassy.addOnReleaseHandlers(_this.onCardReleased);
                });
            }
            if (!_this.open_layout && _this.content) {
                _this.content.measureLayout(function (layout) {
                    _this.open_layout = layout;
                });
            }
        };
        _this._onDrawerClose = function () {
            console.log("Closed Drawer");
            _this.setState({
                visible: false
            });
            TravelingList_1.Embassy.unregisterLandable(_this);
            if (!_this.state.gestureInProgress) { // Don't remove the events if it's causeed by the events themselves
                _this.setState({
                    registered_events: false
                }, function () {
                    TravelingList_1.Embassy.removeOnStartHandlers(_this.onCardPickedUp);
                    TravelingList_1.Embassy.removeOnReleaseHandlers(_this.onCardReleased);
                });
            }
            if (!_this.close_layout && _this.content) {
                _this.content.measureLayout(function (layout) {
                    _this.close_layout = layout;
                });
            }
        };
        _this.openDrawer = function (_, cb) {
            _this.setState({
                visible: true
            }, function () {
                cb && cb();
            });
        };
        _this.closeDrawer = function (_, cb) {
            _this.setState({
                visible: false
            }, function () {
                cb && cb();
            });
        };
        _this.state = {
            visible: false,
            gestureInProgress: false,
            registered_events: false
        };
        _this.open_layout = null;
        _this.close_layout = null;
        _this.content = null;
        _this.drawer = react_1.default.createRef();
        return _this;
    }
    TaskDrawer.prototype.componentDidMount = function () {
    };
    TaskDrawer.prototype.componentWillUnmount = function () {
        console.log("Drawer Unmounting");
    };
    TaskDrawer.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement(react_native_side_menu_1.default, { ref: this.drawer, isOpen: this.state.visible, disableGestures: true, onChange: function (isOpen) {
                isOpen ? _this._onDrawerOpen() : _this._onDrawerClose();
            }, menu: react_1.default.createElement(Content_1.default, { ref: function (ref) { return _this.content = ref; }, task_data: this.props.unallocated_tasks }) }, this.props.children));
    };
    return TaskDrawer;
}(react_1.default.Component));
exports.default = TaskDrawer;
