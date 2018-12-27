"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var native_base_1 = require("native-base");
var EmptyList = function () {
    return react_1.default.createElement(react_native_1.View, { style: { opacity: 0.4, flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center" } },
        react_1.default.createElement(native_base_1.Icon, { type: "Entypo", name: "document" }),
        react_1.default.createElement(react_native_1.Text, { style: { justifyContent: "center", alignItems: "center", fontSize: 20 } }, "Looks Empty..."));
};
exports.default = EmptyList;
