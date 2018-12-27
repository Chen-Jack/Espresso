"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var native_base_1 = require("native-base");
var DrawerHeader = function () {
    var uri = "https://banner2.kisspng.com/20180305/oyq/kisspng-coffee-cup-cafe-drawing-hand-painted-brown-coffee-cup-5a9e09deee1988.8455009715203066549753.jpg";
    return react_1.default.createElement(react_native_1.View, { style: { padding: 0, margin: 0, alignItems: "center", justifyContent: "center", backgroundColor: "#222", height: "25%", width: "100%" } },
        react_1.default.createElement(native_base_1.Thumbnail, { large: true, source: { uri: uri } }),
        react_1.default.createElement(react_native_1.Text, { style: { marginVertical: 10, fontSize: 20, color: "white" } }, " Task Board "));
};
exports.default = DrawerHeader;
