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
var native_base_1 = require("native-base");
var ExitEditModeButton = /** @class */ (function (_super) {
    __extends(ExitEditModeButton, _super);
    function ExitEditModeButton(props) {
        return _super.call(this, props) || this;
    }
    ExitEditModeButton.prototype.render = function () {
        return react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: this.props.onPress, style: { marginRight: 15 } },
            react_1.default.createElement(react_native_1.Animated.View, null,
                react_1.default.createElement(native_base_1.Icon, { type: "MaterialIcons", style: { fontSize: 20, color: "white" }, name: "done" })));
    };
    return ExitEditModeButton;
}(react_1.default.Component));
exports.default = ExitEditModeButton;
