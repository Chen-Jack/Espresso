"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var native_base_1 = require("native-base");
var react_1 = __importDefault(require("react"));
exports.default = (function () {
    return react_1.default.createElement(native_base_1.View, { style: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center" } },
        react_1.default.createElement(native_base_1.Spinner, { color: "black" }));
});
