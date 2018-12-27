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
var TaskCreationForm_1 = __importDefault(require("./TaskCreationForm"));
var TaskCreationModalPrompt = /** @class */ (function (_super) {
    __extends(TaskCreationModalPrompt, _super);
    function TaskCreationModalPrompt(props) {
        var _this = _super.call(this, props) || this;
        _this.togglePrompt = function () {
            _this.setState({
                visible: !_this.state.visible
            });
        };
        _this._finishFormSubmission = function () {
            native_base_1.Toast.show({
                text: 'Your task was added to your board!',
                buttonText: 'Okay'
            });
            _this.togglePrompt();
        };
        _this.state = {
            visible: false
        };
        return _this;
    }
    TaskCreationModalPrompt.prototype.render = function () {
        return react_1.default.createElement(native_base_1.View, null,
            react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: this.togglePrompt }, this.props.trigger),
            react_1.default.createElement(react_native_modal_1.default, { onBackdropPress: this.togglePrompt, isVisible: this.state.visible },
                react_1.default.createElement(native_base_1.View, null,
                    react_1.default.createElement(TaskCreationForm_1.default, { onFormFinishedSubmition: this._finishFormSubmission }))));
    };
    return TaskCreationModalPrompt;
}(react_1.default.Component));
exports.default = TaskCreationModalPrompt;
