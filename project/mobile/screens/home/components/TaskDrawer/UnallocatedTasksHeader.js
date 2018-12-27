"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var PopupMenu_1 = require("./../PopupMenu");
var UnallocatedTasksHeader = function (_a) {
    var task_list = _a.task_list;
    var options = [
        { title: "uh",
            handler: function () { }
        }
    ];
    return react_1.default.createElement(react_native_1.View, { style: {
            backgroundColor: "#222",
            height: 35, width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
        } },
        react_1.default.createElement(react_native_1.Text, { style: { color: "white", marginHorizontal: 10 } },
            " ",
            task_list.length,
            " tasks "),
        react_1.default.createElement(PopupMenu_1.PopupMenu, { date: null, options: options }));
};
exports.default = UnallocatedTasksHeader;
