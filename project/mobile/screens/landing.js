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
// The initial screen when a user opens the app (Before Login)
var react_1 = __importDefault(require("react"));
var native_base_1 = require("native-base");
var react_native_1 = require("react-native");
var LandingScreen = /** @class */ (function (_super) {
    __extends(LandingScreen, _super);
    function LandingScreen(props) {
        var _this = _super.call(this, props) || this;
        _this.register = function () {
            _this.props.navigation.navigate("registration");
        };
        _this.login = function () {
            _this.props.navigation.navigate("login");
        };
        _this._isLoggedIn = function () {
            react_native_1.AsyncStorage.getItem("session_token", function (err, session_token) {
                if (err)
                    console.log("Home screen", err);
                else {
                    if (session_token) {
                        _this.props.navigation.navigate('home');
                    }
                }
            });
        };
        _this._isLoggedIn();
        return _this;
    }
    LandingScreen.prototype.render = function () {
        return react_1.default.createElement(native_base_1.View, null,
            react_1.default.createElement(native_base_1.Text, null, " ESPRESSO "),
            react_1.default.createElement(native_base_1.Button, { onPress: this.register },
                react_1.default.createElement(native_base_1.Text, null, " Register ")),
            react_1.default.createElement(native_base_1.Button, { onPress: this.login },
                react_1.default.createElement(native_base_1.Text, null, " Login ")));
    };
    return LandingScreen;
}(react_1.default.Component));
exports.default = LandingScreen;
