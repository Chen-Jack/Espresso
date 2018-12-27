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
var Context_1 = require("./../../Context");
var native_base_1 = require("native-base");
var react_native_1 = require("react-native");
var TaskEditForm = /** @class */ (function (_super) {
    __extends(TaskEditForm, _super);
    function TaskEditForm(props) {
        var _this = _super.call(this, props) || this;
        _this._submitForm = function (editTask) {
            editTask(_this.props.task_id, _this.state.task_title, _this.state.task_detail, function () {
                _this.props.onFormFinishedSubmition();
            });
        };
        _this.state = {
            form_errors: [],
            task_title: _this.props.title,
            task_detail: _this.props.details
        };
        console.log("taskeditform", _this.props.title, _this.props.details);
        return _this;
    }
    TaskEditForm.prototype.render = function () {
        var _this = this;
        return react_1.default.createElement(Context_1.UserTaskContext.Consumer, null, function (_a) {
            var editTask = _a.editTask;
            return react_1.default.createElement(native_base_1.View, { style: { width: "75%", height: "50%", padding: 20, backgroundColor: "white" } },
                _this.state.form_errors.map(function (err) {
                    return react_1.default.createElement(native_base_1.View, null,
                        react_1.default.createElement(native_base_1.Text, null,
                            " ",
                            err,
                            " "));
                }),
                react_1.default.createElement(native_base_1.Text, null, " Update Task "),
                react_1.default.createElement(react_native_1.TextInput, { autoFocus: true, clearButtonMode: 'while-editing', placeholder: "Title", value: _this.state.task_title, onChangeText: function (txt) { return _this.setState({ task_title: txt }); } }),
                react_1.default.createElement(react_native_1.TextInput, { clearButtonMode: 'while-editing', placeholder: "Details (Optional)", value: _this.state.task_detail, onChangeText: function (txt) { return _this.setState({
                        task_detail: txt
                    }); } }),
                react_1.default.createElement(native_base_1.Button, { onPress: function () { return _this._submitForm(editTask); } },
                    react_1.default.createElement(native_base_1.Text, null, "Submit")));
        });
    };
    return TaskEditForm;
}(react_1.default.Component));
exports.default = TaskEditForm;
