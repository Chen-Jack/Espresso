"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var native_base_1 = require("native-base");
var MenuButton = function (_a) {
    var onPress = _a.onPress;
    return react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: onPress, style: { marginRight: 15 } },
        react_1.default.createElement(native_base_1.Icon, { style: { color: "white" }, name: "more" }));
};
exports.default = MenuButton;
