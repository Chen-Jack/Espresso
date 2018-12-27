"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var Dot_1 = __importDefault(require("./Dot"));
var Markings = function (_a) {
    var markings = _a.markings;
    var renderMarkings = function (markings) {
        if (typeof markings === "object" && markings.hasOwnProperty("dots")) {
            return markings.dots.map(function (dot, index) {
                return react_1.default.createElement(Dot_1.default, { key: index, color: dot.color });
            });
        }
        else {
            return null;
        }
    };
    return react_1.default.createElement(react_native_1.View, { style: { width: "95%", height: 5, flexDirection: "row", justifyContent: "center", alignItems: "center" } }, renderMarkings(markings));
};
exports.default = Markings;
