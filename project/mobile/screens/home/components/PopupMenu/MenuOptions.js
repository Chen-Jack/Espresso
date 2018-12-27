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
var MenuOptions = /** @class */ (function (_super) {
    __extends(MenuOptions, _super);
    function MenuOptions(props) {
        var _this = _super.call(this, props) || this;
        _this._renderItems = function () {
            console.log("options", _this.props.options);
            if (_this.props.options) {
                return _this.props.options.map(function (option, index) {
                    var handler = function () {
                        option.handler(function () {
                            console.log("You chose an option", _this.props.onChooseOption);
                            _this.props.onChooseOption();
                        });
                    };
                    return react_1.default.createElement(native_base_1.ListItem, { key: index },
                        react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: handler },
                            react_1.default.createElement(native_base_1.Text, null,
                                " ",
                                option.title,
                                " ")));
                });
            }
            else {
                return null;
            }
        };
        return _this;
    }
    MenuOptions.prototype.render = function () {
        return react_1.default.createElement(native_base_1.List, { style: { width: 150 } }, this._renderItems());
    };
    return MenuOptions;
}(react_1.default.Component));
exports.default = MenuOptions;
