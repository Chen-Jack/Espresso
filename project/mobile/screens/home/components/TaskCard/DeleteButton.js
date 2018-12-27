"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var native_base_1 = require("native-base");
var react_native_1 = require("react-native");
var Context_1 = require("../../Context");
var DeleteButton = function (_a) {
    var task_id = _a.task_id;
    var triggleDeletePrompt = function (deleteTaskHandler) {
        react_native_1.Alert.alert('Delete Card', "Are you sure?", [
            {
                text: "Cancel",
                onPress: function () { },
                style: "cancel"
            },
            {
                text: "Delete",
                onPress: function () {
                    deleteTaskHandler(task_id);
                }
            }
        ]);
    };
    return react_1.default.createElement(Context_1.UserTaskContext.Consumer, null, function (_a) {
        var deleteTask = _a.deleteTask;
        return react_1.default.createElement(native_base_1.View, null,
            react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: triggleDeletePrompt.bind(_this, deleteTask) },
                react_1.default.createElement(native_base_1.Icon, { style: { fontSize: 20, marginHorizontal: 5 }, name: "trash" })));
    });
};
exports.default = DeleteButton;
