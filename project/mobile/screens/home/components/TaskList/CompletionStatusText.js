"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var CompletionStatusText = function (_a) {
    var task_list = _a.task_list;
    var curr = 0;
    for (var _i = 0, task_list_1 = task_list; _i < task_list_1.length; _i++) {
        var task = task_list_1[_i];
        if (task.completed)
            curr++;
    }
    var max = task_list.length;
    var style = (curr === max) ? { color: "lightgreen" } : { color: "yellow" };
    return (max > 0) ? react_1.default.createElement(react_native_1.Text, { style: style },
        "  ",
        curr,
        " / ",
        max,
        " ") : null;
};
exports.default = CompletionStatusText;
