"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
    Context Operator to update the user's task data
*/
var react_1 = __importDefault(require("react"));
var UserTaskContext = react_1.default.createContext({});
exports.default = UserTaskContext;
