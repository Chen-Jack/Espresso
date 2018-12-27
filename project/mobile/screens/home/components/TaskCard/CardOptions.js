"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var native_base_1 = require("native-base");
var DeleteButton_1 = __importDefault(require("./DeleteButton"));
var EditTaskButton_1 = __importDefault(require("./EditTaskButton"));
var EditModeOptions = function (_a) {
    var task = _a.task;
    // console.log("Called?");
    return react_1.default.createElement(react_native_1.View, { style: { flexDirection: "row" } },
        react_1.default.createElement(EditTaskButton_1.default, { task: task }),
        react_1.default.createElement(DeleteButton_1.default, { task_id: task.task_id }));
};
var CardOptions = function (_a) {
    var task = _a.task, details = _a.details, isEditMode = _a.isEditMode, isCollapsed = _a.isCollapsed, toggleDetails = _a.toggleDetails;
    // console.log("receieved", isEditMode);
    if (isEditMode) {
        return react_1.default.createElement(react_native_1.View, { style: { flexDirection: "row", alignItems: "center" } },
            react_1.default.createElement(EditModeOptions, { task: task }));
    }
    else if (details) {
        return react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: toggleDetails }, isCollapsed ? react_1.default.createElement(native_base_1.Icon, { type: "Entypo", name: "chevron-small-down" }) : react_1.default.createElement(native_base_1.Icon, { type: "Entypo", name: "chevron-small-up" }));
    }
    else {
        return null;
    }
};
exports.default = CardOptions;
