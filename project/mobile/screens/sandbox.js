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
var react_native_snap_carousel_1 = __importDefault(require("react-native-snap-carousel"));
var SandBox = /** @class */ (function (_super) {
    __extends(SandBox, _super);
    function SandBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            canScroll: true,
        };
        _this.enableScroll = function () {
            _this.setState({ canScroll: true });
        };
        _this.disableScroll = function () {
            _this.setState({ canScroll: false });
        };
        _this.renderItems = function () {
            return react_1.default.createElement(react_native_1.View, { style: { width: 300, height: 300, backgroundColor: "orange" } },
                react_1.default.createElement(react_native_1.Text, null, " Test "));
        };
        return _this;
    }
    SandBox.prototype.render = function () {
        return (react_1.default.createElement(react_native_1.View, null,
            react_1.default.createElement(react_native_1.Button, { onPress: this.disableScroll, title: "Disable" }),
            react_1.default.createElement(react_native_1.Button, { onPress: this.enableScroll, title: "Enable" }),
            react_1.default.createElement(react_native_snap_carousel_1.default, { scrollEnabled: this.state.canScroll, data: [1, 2, 3, 4, 5], renderItem: this.renderItems, sliderWidth: react_native_1.Dimensions.get('window').width, itemWidth: react_native_1.Dimensions.get('window').width })));
    };
    return SandBox;
}(react_1.default.Component));
exports.default = SandBox;
