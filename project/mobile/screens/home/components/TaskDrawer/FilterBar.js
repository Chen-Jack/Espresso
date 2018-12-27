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
var react_native_1 = require("react-native");
var FilterBar = /** @class */ (function (_super) {
    __extends(FilterBar, _super);
    function FilterBar(props) {
        var _this = _super.call(this, props) || this;
        _this._changeTextHandler = function (new_text) {
            _this.setState({
                text: new_text
            }, function () {
                _this.props.onChangeText(_this.state.text);
            });
        };
        _this.state = {
            text: ""
        };
        _this.MAX_CHAR_LIMIT = 30;
        return _this;
    }
    FilterBar.prototype.render = function () {
        return react_1.default.createElement(react_native_1.View, { style: { width: "100%", padding: 5 } },
            react_1.default.createElement(react_native_1.View, { style: { backgroundColor: "#555", height: 35, width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 10 } },
                react_1.default.createElement(react_native_1.TextInput, { value: this.state.text, maxLength: this.MAX_CHAR_LIMIT, placeholderTextColor: "white", placeholder: "Filter", onChangeText: this._changeTextHandler, style: { flex: 1, padding: 10, color: "white" } })));
    };
    return FilterBar;
}(react_1.default.Component));
exports.default = FilterBar;
