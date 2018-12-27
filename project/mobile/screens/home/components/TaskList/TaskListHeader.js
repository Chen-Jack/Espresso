"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var utility_1 = require("./../../../../utility");
var CompletionStatusText_1 = __importDefault(require("./CompletionStatusText"));
var PopupMenu_1 = require("./../PopupMenu");
var TaskListHeader = function (_a) {
    var task_list = _a.task_list, date = _a.date;
    var options = [
        {
            title: "Edit",
            handler: function () { }
        },
        {
            title: "Clear List",
            handler: function () { }
        }
    ];
    return react_1.default.createElement(react_native_1.View, { style: { flexDirection: "row", width: "100%", backgroundColor: "#222", alignItems: "center", justifyContent: "space-between" } },
        react_1.default.createElement(react_native_1.View, { style: { flexDirection: "row", justifyContent: "center", alignItems: "center" } },
            react_1.default.createElement(react_native_1.Text, { style: { borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10, fontSize: 16, color: "white" } }, utility_1.getDay((date)) + " | " + (date || "Date")),
            react_1.default.createElement(CompletionStatusText_1.default, { task_list: task_list })),
        task_list.length > 0 && react_1.default.createElement(PopupMenu_1.PopupMenu, { date: date, options: options }));
};
exports.default = TaskListHeader;
