"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var v4_1 = __importDefault(require("uuid/v4"));
var react_native_1 = require("react-native");
var TaskStorage = /** @class */ (function () {
    function TaskStorage() {
    }
    TaskStorage.updateStatus = function (task_id, new_status, cb) {
        new_status = (new_status ? true : false); // Convert all falsy statements to bools
        react_native_1.AsyncStorage.getItem("espresso_app", function (err, app) {
            if (err) {
                return cb(err);
            }
            var app_data = (JSON.parse(app));
            var task = app_data.tasks[task_id];
            task.completed = new_status;
            react_native_1.AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), function (err) {
                if (err) {
                    return cb(err);
                }
                cb();
            });
        });
    };
    TaskStorage.createTask = function (title, details, cb) {
        if (title === void 0) { title = ""; }
        if (details === void 0) { details = ""; }
        var new_task = {
            task_id: v4_1.default(),
            title: title,
            details: details,
            completed: false,
            allocated_date: null
        };
        react_native_1.AsyncStorage.getItem("espresso_app", function (err, app) {
            if (err) {
                return cb && cb(err);
            }
            var app_data = JSON.parse(app);
            var tasks = app_data.tasks;
            tasks[new_task.task_id] = new_task;
            react_native_1.AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), function (err) {
                console.log("Created Task", JSON.stringify(app_data));
                cb && cb(err, new_task);
            });
        });
    };
    TaskStorage.editTask = function (task_id, new_title, new_details, cb) {
        console.log("Editing for " + task_id + " " + new_title + " " + new_details);
        react_native_1.AsyncStorage.getItem("espresso_app", function (err, app) {
            if (err) {
                cb(err);
            }
            var app_data = JSON.parse(app);
            var task = app_data.tasks[task_id];
            task.title = new_title;
            task.details = new_details;
            react_native_1.AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), function (err) {
                cb(err);
            });
        });
    };
    TaskStorage.deleteTask = function (task_id, cb) {
        react_native_1.AsyncStorage.getItem("espresso_app", function (err, app) {
            if (err) {
                cb && cb(err);
            }
            var app_data = JSON.parse(app);
            var tasks = app_data.tasks;
            delete tasks[task_id];
            react_native_1.AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), function (err) {
                cb && cb(err);
            });
        });
    };
    TaskStorage.allocateMultipleTasks = function (task_id_arr, date, cb) {
        react_native_1.AsyncStorage.getItem("espresso_app", function (err, app) {
            if (err) {
                cb && cb(err);
            }
            var app_data = JSON.parse(app);
            var tasks = app_data.tasks;
            for (var _i = 0, task_id_arr_1 = task_id_arr; _i < task_id_arr_1.length; _i++) {
                var task_id = task_id_arr_1[_i];
                tasks[task_id].allocated_date = date;
            }
            react_native_1.AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), function (err) {
                cb && cb(err);
            });
        });
    };
    TaskStorage.allocateTask = function (task_id, date, cb) {
        react_native_1.AsyncStorage.getItem("espresso_app", function (err, app) {
            if (err) {
                cb && cb(err);
            }
            var app_data = JSON.parse(app);
            var task = app_data.tasks[task_id];
            task.allocated_date = date;
            react_native_1.AsyncStorage.setItem("espresso_app", JSON.stringify(app_data), function (err) {
                cb && cb(err);
            });
        });
    };
    return TaskStorage;
}());
exports.default = TaskStorage;
