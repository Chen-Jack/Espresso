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
var SettingScreen = /** @class */ (function (_super) {
    __extends(SettingScreen, _super);
    function SettingScreen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SettingScreen.prototype.render = function () {
        return (react_1.default.createElement(react_native_1.View, null,
            react_1.default.createElement(react_native_1.Button, { title: "Clear All Data", onPress: function () {
                    react_native_1.Alert.alert("HOLD ON", "Are you sure you want to delete all your tasks?", [
                        { text: "Keep my tasks", onPress: function () { }, style: 'cancel' },
                        { text: "Delete EVERYTHING", onPress: function () { react_native_1.AsyncStorage.removeItem("espresso_app"); } }
                    ]);
                } })));
    };
    return SettingScreen;
}(react_1.default.Component));
exports.default = SettingScreen;
