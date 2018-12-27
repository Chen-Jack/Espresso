"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var Dot = function (_a) {
    var color = _a.color;
    console.log("rendering dot");
    return react_1.default.createElement(react_native_1.View, { style: { width: 5, height: 5, marginHorizontal: 1, backgroundColor: color, borderRadius: 100 } });
};
exports.default = Dot;
