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
var Embassy_1 = __importDefault(require("./Embassy"));
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var Draggable = /** @class */ (function (_super) {
    __extends(Draggable, _super);
    function Draggable(props) {
        var _this = _super.call(this, props) || this;
        _this.getAnimationType = function (final_destination) {
            if (final_destination === Embassy_1.default.SAME_TARGET) {
                console.log("back to square 1");
                return react_native_1.Animated.timing(_this.state.pan, {
                    toValue: _this.initial_position,
                    duration: _this.animation_speed
                });
            }
            else if (final_destination === Embassy_1.default.NEW_TARGET) {
                console.log("time to shrink");
                return react_native_1.Animated.timing(_this.state.scale, {
                    toValue: 0,
                    duration: _this.animation_speed
                });
            }
            else if (final_destination === Embassy_1.default.TARGET_LEFT) {
                console.log("GO LEFTTT");
                _this.initial_position.x = -1500;
                return react_native_1.Animated.timing(_this.state.pan, {
                    toValue: _this.initial_position,
                    duration: _this.animation_speed * 1.75
                });
            }
            else if (final_destination === Embassy_1.default.TARGET_RIGHT) {
                console.log("GOO RIGHHT");
                _this.initial_position.x = 2000;
                return react_native_1.Animated.timing(_this.state.pan, {
                    toValue: _this.initial_position,
                    duration: _this.animation_speed * 1.75
                });
            }
            else {
                console.log("Count not recognize the corresponding animation type for that target...");
            }
        };
        _this._onLayoutHandler = function (e) {
            _this.default_size = {
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height
            };
        };
        _this.long_press_callback = function (e, gestureState) {
            console.log("LONG PRESS ", e.nativeEvent, gestureState);
            var coordinates = {
                x: e.nativeEvent.pageX,
                y: e.nativeEvent.pageY
            };
            Embassy_1.default.onStartTraveling(coordinates, _this.props.source);
            _this.draggable.current.measure(function (x, y, width, height, pageX, pageY) {
                _this.initial_position = {
                    x: pageX,
                    y: pageY
                };
            });
            var center_offset = {
                x: _this.default_size.width / 2,
                y: _this.default_size.height / 2
            };
            _this.state.pan.setOffset({ x: _this.state.pan.x._value, y: _this.state.pan.y._value });
            _this.state.pan.setValue({
                x: gestureState.x0 - center_offset.x,
                y: gestureState.y0 - center_offset.y
            });
            _this.setState({
                focus: true
            }, function () {
                console.log("Done focus set");
                react_native_1.Animated.parallel([
                    react_native_1.Animated.spring(_this.state.modal_scale, {
                        toValue: 1.1,
                        friction: 3,
                    }),
                    react_native_1.Animated.spring(_this.state.scale, {
                        toValue: 0,
                        friction: 3,
                    })
                ]).start();
            });
            _this.gesture_started = true;
        };
        _this.state = {
            pan: new react_native_1.Animated.ValueXY(),
            focus: false,
            scale: new react_native_1.Animated.Value(0),
            modal_scale: new react_native_1.Animated.Value(1)
        };
        _this.animation_speed = 500;
        _this.time_of_last_press = Date.now();
        _this.waiting_for_second_tap = false;
        _this.ms_to_trigger_double_tap = 350;
        _this.ms_to_trigger_long_press = 300;
        _this.timer_ref = null;
        _this.gesture_started = false;
        _this.default_size = { width: 0, height: 0 };
        _this.initial_position = { x: 0, y: 0 };
        _this.draggable = react_1.default.createRef();
        _this._panResponder = react_native_1.PanResponder.create({
            // onStartShouldSetResponder: (evt, gesture) => true,
            // onStartShouldSetResponderCapture: (evt,gesture)=> true,
            onStartShouldSetPanResponder: function () { return true; },
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            // onMoveShouldSetResponder: (evt, gestureState) => true,
            // onMoveShouldSetResponderCapture : (evt, gesture) => true,
            onMoveShouldSetPanResponder: function () { return true; },
            // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: function (e, gestureState) {
                e.persist(); //Must persist event to access async
                var time_of_press = Date.now();
                if (_this.waiting_for_second_tap) {
                    if (time_of_press - _this.time_of_last_press < _this.ms_to_trigger_double_tap) {
                        clearTimeout(_this.timer_ref);
                        _this.timer_ref = null;
                        _this.waiting_for_second_tap = false;
                        _this.props.doubleTapHandler();
                    }
                    _this.time_of_last_press = time_of_press;
                }
                else { // First Tap
                    _this.waiting_for_second_tap = true;
                    _this.time_of_last_press = time_of_press;
                }
                //Start timeout for long press
                _this.timer_ref = setTimeout(_this.long_press_callback.bind(_this, e, gestureState), _this.ms_to_trigger_long_press);
            },
            onPanResponderMove: function (_a, gestureState) {
                var nativeEvent = _a.nativeEvent;
                if (!_this.gesture_started) {
                    // If you move when you arent allowed to move yet, clear the timer
                    clearTimeout(_this.timer_ref);
                    _this.timer_ref = null;
                }
                else {
                    var center_offset = {
                        x: _this.default_size.width / 2,
                        y: _this.default_size.height / 2
                    };
                    _this.state.pan.setValue({
                        x: gestureState.moveX - center_offset.x,
                        y: gestureState.moveY - center_offset.y
                    });
                    var coordinates = {
                        x: nativeEvent.pageX,
                        y: nativeEvent.pageY
                    };
                    Embassy_1.default.onTravel(coordinates);
                }
            },
            // onResponderTerminationRequest: (e,gesturestate) => {
            //     return false
            // },
            onPanResponderTerminationRequest: function () { return false; },
            onPanResponderRelease: function (e) {
                if (!_this.gesture_started) {
                    //Released too early before actually starting gesture
                    clearTimeout(_this.timer_ref);
                    _this.timer_ref = null;
                }
                else {
                    var coordinates = {
                        x: e.nativeEvent.pageX,
                        y: e.nativeEvent.pageY
                    };
                    Embassy_1.default.onFinishTraveling(coordinates, function (final_destination) {
                        console.log("FINAL DESTINATION IS", final_destination);
                        var animation = _this.getAnimationType(final_destination);
                        animation && animation.start(function () {
                            _this.setState({
                                focus: false
                            }, function () {
                                _this.state.pan.setValue({ x: 0, y: 0 });
                                _this.state.pan.flattenOffset();
                            });
                        });
                    });
                    // Animated.parallel([
                    // Animated.timing(                
                    //     this.state.modal_scale,         
                    //     {
                    //         toValue: 0,                 
                    //         duration: this.animation_speed,              
                    //     }
                    // ),
                    // Animated.timing(
                    //     this.state.pan,
                    //     {
                    //         toValue: this.initial_position,
                    //         duration: 500
                    //     }
                    // ),
                    // Animated.timing(
                    //     this.state.scale,
                    //     {
                    //         toValue: 1,
                    //         duration: this.animation_speed
                    //     }
                    // )
                    // ]).start(()=>{  
                    //     this.setState({
                    //         focus: false
                    //     }, ()=>{
                    //         this.state.pan.setValue({x: 0, y: 0});
                    //         this.state.pan.flattenOffset();
                    //     })
                    // })
                    _this.gesture_started = false;
                }
            }
        });
        return _this;
    }
    Draggable.prototype.componentWillMount = function () {
        react_native_1.Animated.spring(// Animate over time
        this.state.scale, // The animated value to drive
        {
            toValue: 1,
            friction: 3
        }).start();
    };
    Draggable.prototype.componentWillUnmount = function () {
        console.log("Draggable Unmounting");
    };
    Draggable.prototype.render = function () {
        // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
        var defaultSizeStyle = { width: this.default_size.width, height: this.default_size.height };
        var translateStyle = { transform: [{ translateX: this.state.pan.x }, { translateY: this.state.pan.y }] };
        var modalScaleStyle = { transform: [{ scaleX: this.state.modal_scale }, { scaleY: this.state.modal_scale }] };
        var modalStyle = { transform: translateStyle.transform.concat(modalScaleStyle.transform) };
        var scaleStyle = { transform: [{ scaleX: this.state.scale }, { scaleY: this.state.scale }] };
        return (react_1.default.createElement(react_native_1.View, __assign({ ref: this.draggable }, this._panResponder.panHandlers, { onLayout: this._onLayoutHandler }),
            react_1.default.createElement(react_native_1.Modal, { visible: this.state.focus, transparent: true },
                react_1.default.createElement(react_native_1.Animated.View, { style: [modalStyle, defaultSizeStyle] }, this.props.children)),
            react_1.default.createElement(react_native_1.Animated.View, { style: [{ opacity: this.state.focus ? 0 : 1 }] }, this.props.children)));
    };
    return Draggable;
}(react_1.default.Component));
exports.default = Draggable;
