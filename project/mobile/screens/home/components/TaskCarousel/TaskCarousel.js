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
var react_native_snap_carousel_1 = __importDefault(require("react-native-snap-carousel"));
var native_base_1 = require("native-base");
var react_native_1 = require("react-native");
var TaskList_1 = require("../TaskList");
var TravelingList_1 = require("../TravelingList");
var LoadingCarouselView_1 = __importDefault(require("./LoadingCarouselView"));
var TaskCarousel = /** @class */ (function (_super) {
    __extends(TaskCarousel, _super);
    function TaskCarousel(props) {
        var _this = _super.call(this, props) || this;
        _this._getReference = function (index) {
            return _this["task_" + index];
        };
        _this.getList = function () {
            return _this.focused_list;
        };
        _this._onSnapHandler = function (index) {
            _this.updateFocusedListLayout(index);
            _this._handleNewDateSelection(index);
            _this.focused_list && _this.focused_list.onGestureLoseFocus();
        };
        _this.disableAllListScroll = function () {
            //Subscribed Event Handler
            for (var i = 0; i < _this.props.task_data.length; i++) {
                var ref = _this._getReference(i);
                ref && ref.toggleScroll(false);
            }
        };
        _this.disableCurrentListScroll = function () {
            _this.focused_list && _this.focused_list.toggleScroll(false);
        };
        _this.enableCurrentListScroll = function () {
            _this.focused_list && _this.focused_list.toggleScroll(true);
        };
        _this.enableAllListScroll = function () {
            //Subscribed Event Handler
            for (var i = 0; i < _this.props.task_data.length; i++) {
                var ref = _this._getReference(i);
                ref && ref.toggleScroll(true);
            }
        };
        _this._onCardPickedUp = function (coordinates) {
            //Subscribed Event Handler
            _this.focused_list_from_gesture_start = _this.focused_list;
            var direction = _this.whichEdgeIsGestureOn(coordinates);
            if (_this.autoScrollingTimer === null && (direction === "LEFT" || direction === "RIGHT")) {
                _this.enableAutoScroller(direction);
            }
            else if (_this.autoScrollingTimer && direction === "NONE") {
                _this.disableAutoScroller();
            }
        };
        _this._onCardMoved = function (coordinates) {
            var direction = _this.whichEdgeIsGestureOn(coordinates);
            if (!_this.autoScrollingTimer && (direction === "LEFT" || direction === "RIGHT")) {
                _this.enableAutoScroller(direction);
            }
            else if (_this.autoScrollingTimer && direction === "NONE") {
                _this.disableAutoScroller();
            }
        };
        _this._onCardReleased = function () {
            //Subscribed Event Handler
            _this.disableAutoScroller();
        };
        _this.enableAutoScroller = function (direction) {
            var MS_PER_SCROLL = 400;
            _this.autoScrollingTimer = setInterval(function () {
                if (direction === "RIGHT") {
                    _this.carousel.current && _this.carousel.current.snapToNext();
                    TravelingList_1.Embassy.carouselTurn(1);
                }
                else if (direction === "LEFT") {
                    _this.carousel.current && _this.carousel.current.snapToPrev();
                    TravelingList_1.Embassy.carouselTurn(-1);
                }
                else if (direction === "NONE") {
                }
                else {
                    console.log("Receieved invalid direction in enableAutoScroller");
                }
            }, MS_PER_SCROLL);
        };
        _this.disableAutoScroller = function () {
            clearInterval(_this.autoScrollingTimer);
            _this.autoScrollingTimer = null;
        };
        _this.whichEdgeIsGestureOn = function (coordinates) {
            /*
            Checks to see if the given coordinates should trigger a carousel scroll
            */
            if (_this.layout) {
                var scroll_lax = _this.layout.width * 0.2;
                if ((_this.layout.y < coordinates.y) && (coordinates.y < _this.layout.y + _this.layout.height)) {
                    if (coordinates.x < scroll_lax) {
                        return "LEFT";
                    }
                    else if (coordinates.x > (_this.layout.x + _this.layout.width) - scroll_lax) {
                        return "RIGHT";
                    }
                    else {
                        return "NONE";
                    }
                }
                else {
                    return "NONE";
                }
            }
            else
                return "NONE";
        };
        _this.isGestureOnTop = function (gesture_coordinates) {
            /*
            Checks if the given coordinates are ontop of the focused landable
            */
            if (!gesture_coordinates.x || !gesture_coordinates.y) {
                console.log("You forgot params");
                return false;
            }
            if (!_this.focused_list_layout)
                return false;
            var x0 = _this.focused_list_layout.x;
            var y0 = _this.focused_list_layout.y;
            var x1 = _this.focused_list_layout.x + _this.focused_list_layout.width;
            var y1 = _this.focused_list_layout.y + _this.focused_list_layout.height;
            var isWithinX = (x0 < gesture_coordinates.x) && (gesture_coordinates.x < x1);
            var isWithinY = (y0 < gesture_coordinates.y) && (gesture_coordinates.y < y1);
            if (isWithinX && isWithinY) {
                return true;
            }
            else {
                return false;
            }
        };
        _this.enableCarouselScroll = function (_) {
            _this.setState({
                canScroll: true
            });
        };
        _this.disableCarouselScroll = function (_) {
            _this.setState({
                canScroll: false
            });
        };
        _this._onLayout = function () {
            if (_this.wrapper) {
                _this.wrapper.current._root.measure(function (x, y, width, height, pageX, pageY) {
                    var layout = {
                        x: pageX,
                        y: pageY,
                        width: width,
                        height: height
                    };
                    _this.layout = layout;
                });
            }
        };
        _this.updateToDate = function (date) {
            console.log("Updating to", date, " and comparing to", _this.props.task_data);
            var index = -1;
            for (var i in _this.props.task_data) {
                var task_set = _this.props.task_data[i];
                if (task_set.date === date) {
                    index = parseInt(i);
                    break;
                }
            }
            if (index !== -1)
                _this.carousel.current.snapToItem(index);
            else
                console.log("Index not found on calendar");
        };
        _this._handleNewDateSelection = function (data_index) {
            var iso_date = _this.props.task_data[data_index].date;
            _this.props.handleDateSelection(iso_date);
        };
        _this._renderTaskList = function (_a) {
            var task_set = _a.item, index = _a.index;
            return react_1.default.createElement(native_base_1.View, { key: index, style: {
                    marginVertical: 10,
                    height: "90%",
                    width: "100%",
                    backgroundColor: "#ccc",
                    alignSelf: "center",
                    shadowOpacity: 0.7,
                    shadowColor: "black",
                    shadowOffset: { width: 5, height: 5 },
                    shadowRadius: 5
                } },
                react_1.default.createElement(TaskList_1.TaskList, { initialize: (index === _this.STARTING_INDEX) ? _this._initializeLayout : null, ref: function (ref) { _this["task_" + index] = ref; }, index: index, date: task_set.date, tasks: task_set.tasks }));
        };
        _this.updateFocusedListLayout = function (index) {
            var ref = _this._getReference(index);
            // ref && ref.measureLayout((layout: Layout) => {
            //     this.focused_list = ref
            //     this.focused_list_layout = layout
            // })
            ref && (_this.focused_list = ref);
        };
        _this._initializeLayout = function (list, layout) {
            /*
            Intended to only be passed into the tasklist with the STARTING INDEX.
            This is to workaround to measure the initial dimensions since the drawer
            seems to bug out the first round of measurements
            */
            console.log("Initialized Carousel's first Item");
            _this.focused_list = list;
            _this.focused_list_layout = layout;
        };
        _this.state = {
            canScroll: true,
            task_cards_references: []
        };
        _this.STARTING_INDEX = 60;
        _this.carousel = react_1.default.createRef();
        _this.wrapper = react_1.default.createRef();
        _this.focused_list_from_gesture_start = null;
        _this.focused_list = null;
        _this.focused_list_layout = null;
        _this.layout = null;
        _this.autoScrollingTimer = null;
        return _this;
        //There will be a collection of references to each task_list.
        //The references are assigned when the list is rendered.
    }
    TaskCarousel.prototype.componentWillUnmount = function () {
        console.log("Carousel Unmounting");
    };
    // getLayout = (): Layout =>{
    //     if(this.focused_list_layout)
    //         return this.focused_list_layout
    //     else
    //         return {x:0, y: 0, width:0, height: 0}
    // }
    TaskCarousel.prototype.componentDidMount = function () {
        TravelingList_1.Embassy.registerLandable(this);
        var onStartHandlers = [this._onCardPickedUp, this.disableCurrentListScroll, this.disableCarouselScroll];
        var onMoveHandlers = [this._onCardMoved];
        var onReleaseHandlers = [this._onCardReleased, this.enableCurrentListScroll,
            this.enableCarouselScroll];
        TravelingList_1.Embassy.addOnStartHandlers(onStartHandlers);
        TravelingList_1.Embassy.addOnMoveHandlers(onMoveHandlers);
        TravelingList_1.Embassy.addOnReleaseHandlers(onReleaseHandlers);
    };
    TaskCarousel.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (this.state === nextState && this.props === nextProps) {
            console.log("NOT Rerendering");
            return false;
        }
        else {
            console.log("rererendering");
            return true;
        }
    };
    TaskCarousel.prototype.render = function () {
        return (react_1.default.createElement(native_base_1.View, { ref: this.wrapper, onLayout: this._onLayout, style: {
                flexDirection: "column",
                flex: 1,
                width: "100%",
                marginBottom: 50,
                paddingBottom: 10,
                backgroundColor: "white" /*"#2460c1"*/,
            } }, (this.props.isLoading) ? react_1.default.createElement(LoadingCarouselView_1.default, null) : react_1.default.createElement(react_native_snap_carousel_1.default, { firstItem: this.STARTING_INDEX, ref: this.carousel, onSnapToItem: this._onSnapHandler, useScrollView: true, lockScrollWhileSnapping: true, scrollEnabled: this.state.canScroll, data: this.props.task_data, renderItem: this._renderTaskList, sliderWidth: react_native_1.Dimensions.get('window').width, itemWidth: react_native_1.Dimensions.get('window').width * 0.75 })));
    };
    return TaskCarousel;
}(react_1.default.Component));
exports.default = TaskCarousel;
