"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var native_base_1 = require("native-base");
var react_native_1 = require("react-native");
var Context_1 = require("./../../Context");
var TaskCreationForm = /** @class */ (function (_super) {
    __extends(TaskCreationForm, _super);
    function TaskCreationForm(props) {
        var _this = _super.call(this, props) || this;
        _this._submitForm = function (createTask) {
            createTask(_this.state.task_title, _this.state.task_detail, function (err) {
                if (err) {
                    return console.log("ERROR WHEN CREATING TASK", err);
                }
                _this.props.onFormFinishedSubmition();
            });
        };
        _this.state = {
            form_errors: [],
            task_title: "",
            task_detail: ""
        };
        return _this;
    }
    TaskCreationForm.prototype.render = function () {
        var _this = this;
        return react_1.default.createElement(Context_1.UserTaskContext.Consumer, null, function (_a) {
            var createTask = _a.createTask;
            return react_1.default.createElement(native_base_1.View, { style: { padding: 20, backgroundColor: "white" } },
                _this.state.form_errors.map(function (err) {
                    return react_1.default.createElement(native_base_1.View, null,
                        react_1.default.createElement(native_base_1.Text, null,
                            " ",
                            err,
                            " "));
                }),
                react_1.default.createElement(native_base_1.Text, null, " Create Task"),
                react_1.default.createElement(react_native_1.TextInput, { clearButtonMode: 'while-editing', placeholder: "Title", autoFocus: true, onChangeText: function (txt) { return _this.setState({ task_title: txt }); } }),
                react_1.default.createElement(react_native_1.TextInput, { clearButtonMode: 'while-editing', placeholder: "Details (Optional)", onChangeText: function (txt) { return _this.setState({ task_detail: txt }); } }),
                react_1.default.createElement(native_base_1.Button, { onPress: function () { return _this._submitForm(createTask); } },
                    react_1.default.createElement(native_base_1.Text, null, "Submit")));
        });
    };
    return TaskCreationForm;
}(react_1.default.Component));
exports.default = TaskCreationForm;
