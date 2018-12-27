"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_navigation_1 = require("react-navigation");
var landing_1 = __importDefault(require("./screens/landing"));
var registration_1 = __importDefault(require("./screens/registration"));
var home_1 = __importDefault(require("./screens/home/home"));
var login_1 = __importDefault(require("./screens/login"));
var sandbox_1 = __importDefault(require("./screens/sandbox"));
var settings_1 = __importDefault(require("./screens/settings"));
var StackNavigation = react_navigation_1.createStackNavigator({
    home: home_1.default,
    sandbox: sandbox_1.default,
    landing: landing_1.default,
    login: login_1.default,
    registration: registration_1.default,
    settings: settings_1.default
});
exports.default = (function () {
    return react_1.default.createElement(StackNavigation, null);
});
