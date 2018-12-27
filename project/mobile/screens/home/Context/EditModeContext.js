"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var EditModeContext = react_1.default.createContext({ isEditMode: false, toggleEditMode: function () { } });
exports.default = EditModeContext;
