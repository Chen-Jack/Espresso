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
var react_native_modal_1 = __importDefault(require("react-native-modal"));
var TaskForm_1 = require("./../TaskForm");
var EditTaskButton = /** @class */ (function (_super) {
    __extends(EditTaskButton, _super);
    function EditTaskButton(props) {
        var _this = _super.call(this, props) || this;
        _this.togglePrompt = function () {
            _this.setState({
                isEditing: !_this.state.isEditing
            });
        };
        _this.state = {
            isEditing: false
        };
        return _this;
    }
    EditTaskButton.prototype.render = function () {
        return react_1.default.createElement(native_base_1.View, null,
            react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: this.togglePrompt },
                react_1.default.createElement(native_base_1.Icon, { style: { fontSize: 20, marginHorizontal: 5 }, type: "FontAwesome", name: "pencil" })),
            react_1.default.createElement(react_native_modal_1.default, { onBackdropPress: this.togglePrompt, style: { justifyContent: "center", alignItems: "center" }, isVisible: this.state.isEditing },
                react_1.default.createElement(TaskForm_1.TaskEditForm, { task_id: this.props.task.task_id, title: this.props.task.title, details: this.props.task.details, onFormFinishedSubmition: this.togglePrompt })));
    };
    return EditTaskButton;
}(react_1.default.Component));
exports.default = EditTaskButton;
