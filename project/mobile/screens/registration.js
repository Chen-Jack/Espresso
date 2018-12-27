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
var RegistrationForm = /** @class */ (function (_super) {
    __extends(RegistrationForm, _super);
    function RegistrationForm(props) {
        var _this = _super.call(this, props) || this;
        _this._storeSessionToken = function (token) {
            return new Promise(function (resolve, reject) {
                react_native_1.AsyncStorage.setItem("session_token", token, function (err) {
                    if (err) {
                        console.log("Error with async storage storing token", err);
                        reject(err);
                    }
                    else {
                        resolve();
                        console.log("Successfully stored token");
                    }
                });
            });
        };
        _this.submitForm = function () {
            var formData = {
                username: _this.state.usernameField,
                password: _this.state.passwordField,
                passwordConfirm: _this.state.passwordConfirmField,
                email: _this.state.emailField
            };
            fetch("http:/localhost:3000/create-account", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(function (res) {
                console.log("THE STATUS IS", res.status);
                if (res.ok) {
                    //if good, save token and navigate to home
                    res.json().then(function (token) {
                        console.log("Receieved token", token);
                        _this._storeSessionToken(token).then(function () {
                            _this.props.successRedirect();
                        });
                    });
                }
                if (res.status === 400) {
                    //if bad, just show errors
                    console.log("400 status");
                    res.json().then(function (errors_text) {
                        console.log("RESPONSE", errors_text, "?");
                        _this.setState({
                            form_errors: errors_text
                        });
                    });
                }
                else {
                    console.log("Unknown status");
                }
            })
                .catch(function (err) {
                console.log("ERROR", err);
            });
        };
        _this.state = {
            form_errors: [],
            usernameField: "",
            passwordField: "",
            passwordConfirmField: "",
            emailField: ""
        };
        return _this;
    }
    RegistrationForm.prototype.render = function () {
        var _this = this;
        return react_1.default.createElement(native_base_1.View, null,
            this.state.form_errors.map(function (error) {
                return react_1.default.createElement(native_base_1.Text, null,
                    " ",
                    error,
                    " ");
            }),
            react_1.default.createElement(native_base_1.Form, null,
                react_1.default.createElement(native_base_1.Item, null,
                    react_1.default.createElement(native_base_1.Input, { onChangeText: function (txt) { return _this.setState({ usernameField: txt }); }, placeholder: "Username", value: this.state.usernameField })),
                react_1.default.createElement(native_base_1.Item, null,
                    react_1.default.createElement(native_base_1.Input, { onChangeText: function (txt) { return _this.setState({ passwordField: txt }); }, placeholder: "Password", value: this.state.passwordField })),
                react_1.default.createElement(native_base_1.Item, null,
                    react_1.default.createElement(native_base_1.Input, { onChangeText: function (txt) { return _this.setState({ passwordConfirmField: txt }); }, placeholder: "Confirm Password", value: this.state.passwordConfirmField })),
                react_1.default.createElement(native_base_1.Item, null,
                    react_1.default.createElement(native_base_1.Input, { onChangeText: function (txt) { return _this.setState({ emailField: txt }); }, placeholder: "Email", value: this.state.emailField }))),
            react_1.default.createElement(native_base_1.Button, { onPress: this.submitForm },
                react_1.default.createElement(native_base_1.Text, null, " SUBMIT ")));
    };
    return RegistrationForm;
}(react_1.default.Component));
var RegistrationScreen = /** @class */ (function (_super) {
    __extends(RegistrationScreen, _super);
    function RegistrationScreen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RegistrationScreen.prototype.render = function () {
        var _this = this;
        return react_1.default.createElement(native_base_1.Container, null,
            react_1.default.createElement(native_base_1.Content, null,
                react_1.default.createElement(native_base_1.Text, null, " REGISTER "),
                react_1.default.createElement(RegistrationForm, { successRedirect: function () { return _this.props.navigation.navigate("home"); } })));
    };
    return RegistrationScreen;
}(react_1.default.Component));
exports.default = RegistrationScreen;
