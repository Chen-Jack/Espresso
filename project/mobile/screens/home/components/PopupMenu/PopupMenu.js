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
var react_native_modal_1 = __importDefault(require("react-native-modal"));
var MenuOptions_1 = __importDefault(require("./MenuOptions"));
var ExitEditModeButton_1 = __importDefault(require("./ExitEditModeButton"));
var MenuButton_1 = __importDefault(require("./MenuButton"));
var Context_1 = require("./../../Context");
var PopupMenu = /** @class */ (function (_super) {
    __extends(PopupMenu, _super);
    function PopupMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleMenu = function (state) {
            if (!_this.state.isVisible) {
                Promise.all([
                    new Promise(function (resolve) {
                        _this.menu.current.measure(function (x, y, width, height, pageX, pageY) {
                            var location = { x: pageX, y: pageY };
                            _this.setState({
                                location: location
                            }, resolve);
                        });
                    }),
                    new Promise(function (resolve) {
                        //If the dimensions havent been measured yet
                        if (_this.state.dimensions.width === 0 && _this.state.dimensions.height === 0) {
                            _this.popup_content.current.measure(function (x, y, width, height, pageX, pageY) {
                                var dimensions = {
                                    x: x,
                                    y: y,
                                    width: width,
                                    height: height
                                };
                                // console.log("measured to be", dimensions);
                                _this.setState({
                                    dimensions: dimensions
                                }, resolve);
                            });
                        }
                        else
                            resolve();
                    })
                ]).then(function () {
                    _this.setState({
                        isVisible: (state) ? state : !_this.state.isVisible
                    });
                });
            }
            else {
                _this.setState({
                    isVisible: !_this.state.isVisible
                });
            }
        };
        _this.menu = react_1.default.createRef();
        _this.popup_content = react_1.default.createRef();
        _this.state = {
            location: { x: 0, y: 0 },
            dimensions: { x: 0, y: 0, width: 0, height: 0 },
            isVisible: false
        };
        return _this;
    }
    PopupMenu.prototype.componentDidMount = function () {
    };
    PopupMenu.prototype.componentWillUnmount = function () {
        console.log("Popupmenu unmounted");
    };
    PopupMenu.prototype.render = function () {
        var _this = this;
        return react_1.default.createElement(Context_1.UserTaskContext.Consumer, null, function (_a) {
            var deallocateTasksFromDate = _a.deallocateTasksFromDate;
            return react_1.default.createElement(Context_1.EditModeContext.Consumer, null, function (_a) {
                var isEditMode = _a.isEditMode, toggleEditMode = _a.toggleEditMode;
                // Read from context and bind the context function to the options
                for (var _i = 0, _b = _this.props.options; _i < _b.length; _i++) {
                    var option = _b[_i];
                    if (option.title === "Edit") {
                        option.handler = toggleEditMode;
                    }
                    else if (option.title === "Clear List") {
                        var boundHandler = function (cb) {
                            deallocateTasksFromDate(_this.props.date, cb);
                        };
                        option.handler = boundHandler;
                    }
                }
                return (react_1.default.createElement(react_native_1.View, { ref: _this.menu },
                    isEditMode ?
                        react_1.default.createElement(ExitEditModeButton_1.default, { onPress: function () { return toggleEditMode(); } }) :
                        react_1.default.createElement(MenuButton_1.default, { onPress: _this.toggleMenu.bind(_this, true) }),
                    react_1.default.createElement(react_native_1.View, { ref: _this.popup_content },
                        react_1.default.createElement(react_native_modal_1.default, { animationIn: "fadeIn", animationOut: "fadeOut", style: { margin: 0, position: "absolute", width: "100%", height: "100%" }, backdropOpacity: 0.2, onBackdropPress: _this.toggleMenu.bind(_this, false), isVisible: _this.state.isVisible },
                            react_1.default.createElement(react_native_1.View, { style: {
                                    margin: 0,
                                    position: "absolute",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    top: _this.state.location.y,
                                    left: _this.state.location.x - 150,
                                    backgroundColor: "white",
                                    shadowOpacity: 0.5, shadowColor: "black",
                                    shadowOffset: { width: 5, height: 5 },
                                    shadowRadius: 3
                                } },
                                react_1.default.createElement(MenuOptions_1.default, { onChooseOption: _this.toggleMenu, options: _this.props.options }))))));
            });
        });
    };
    return PopupMenu;
}(react_1.default.Component));
exports.default = PopupMenu;
