"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _user = _interopRequireDefault(require("../models/user"));

var _sqlQueries = _interopRequireDefault(require("../db/sqlQueries"));

var _connection = _interopRequireDefault(require("../db/connection"));

require("babel-polyfill");

var _v = _interopRequireDefault(require("uuid/v1"));

var _authentication = _interopRequireDefault(require("../helpers/authentication"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// declare the variable to store users
var userControllers = {}; // fetch all users.

var fetchAllUsers = function fetchAllUsers(req, res) {
  var users = (0, _connection.default)('SELECT * FROM users');
  users.then(function (response) {
    if (response.length > 0) {
      res.send(response);
    } else {
      res.send({
        message: 'There is no user at the moment.'
      });
    }
  }).catch(function (error) {
    return console.log(error);
  });
}; // create a user


var createUser = function createUser(req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      email = _req$body.email,
      password = _req$body.password;

  if (!name || !email || !password) {
    res.send({
      message: 'Please complete the required fields'
    });
  } else {
    var fieldsValidation = /^[a-zA-Z]+/;

    if (!fieldsValidation.test(name)) {
      res.status(400).send({
        message: 'Invalid name, the name should start with letter'
      });
    } else if (!fieldsValidation.test(email)) {
      res.status(400).send({
        message: 'Invalid email, the email should start with letter'
      });
    } else {
      // generate the id and pass it to a user
      var id = (0, _v.default)();

      var token = _authentication.default.encodeToken({
        name: name,
        email: email,
        password: password,
        userId: id
      });

      var user1 = new _user.default(id, name, email, password);
      var promise = (0, _connection.default)(_sqlQueries.default.registerUser, [user1.id, user1.name, user1.email, user1.password]);
      promise.then(function (response) {
        res.status(200).send({
          message: 'User registered successfully',
          response: {
            name: name,
            email: email
          },
          token: token
        });
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
}; // send sign up page.
// const singUpPage = (req, res) => {
//   res.send('signup');
// };
// get a user


var getUser = function getUser(req, res) {
  var id = parseInt(req.params.id); // const specificUser = users.find(item => item.id === id);

  var specificUser = (0, _connection.default)('SELECT * FROM users WHERE id =$1', [id]);
  specificUser.then(function (response) {
    if (response) {
      res.status(200).send(response[0]);
    } else {
      res.send({
        message: 'There is no user with that id'
      });
    }
  }).catch(function (error) {
    return console.log(error);
  });
}; // Login data processing


var login = function login(req, res) {
  var specificUser = users.find(function (user) {
    // let specificUser = execute(queries.checkUser,[id])
    // replace the password given with the hashed password
    if (user.email === req.body.email && user.password === req.body) {
      return user;
    }
  });

  if (specificUser) {
    req.session.user = specificUser; // redirect the user to the next page.

    res.status(200).send({
      message: 'User logged in successfully'
    });
  }

  res.send('Invalid login');
}; // login verification;


var loginRequired = function loginRequired(req, res) {
  if (req.session.user) {
    next();
  } else {
    res.end('Not looged in');
  }
}; // sign out


var signOut = function signOut(req, res) {
  var specificUser = users.find(function (user) {
    return user.email === req.body.email && user.password === req.body.password;
  });

  if (specificUser) {
    req.session.user = specificUser; // redirect the user to the next page.

    res.redirect('/api/v1/');
  }

  res.end('Invalid login');
};

var deleteUsers = function deleteUsers(req, res) {
  var parcels = (0, _connection.default)('DELETE FROM users '); // orders = [];

  parcels.then(function (response) {
    res.status(200).send({
      message: 'Orders deleted successfully',
      response: response
    });
  }).catch(function (error) {
    res.status(400).send({
      error: error
    });
  });
};

userControllers.fetchAllUsers = fetchAllUsers;
userControllers.getUser = getUser;
userControllers.createUser = createUser;
userControllers.loginRequired = loginRequired;
userControllers.login = login;
userControllers.signOut = signOut;
userControllers.deleteUsers = deleteUsers;
var _default = userControllers;
exports.default = _default;