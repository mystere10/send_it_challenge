"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parcels = _interopRequireDefault(require("./routes/parcels"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//instantiate the app; 
var app = (0, _express.default)(); //set the middle ware to use for body parsing

app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
})); //set the router to use. 

app.use('/api', _parcels.default); //Set the port for listening on.

var port = process.env.PORT || 3000;
app.listen(port); //export the app for testing

var _default = app;
exports.default = _default;