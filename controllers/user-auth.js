'use strict';
const User = require('../models/user');
const userNotFound = { error : 'not found user' };
const jwt = require('../services/jwt');

const UserAuth = (req, res) => {
  const user = req.body;
  User.findOne({email : user.email})
    .then(data => validUser(data, user, res),
          err  => fail(400, err, res))
    .catch(()  => fail(400, userNotFound, res));
};

module.exports = UserAuth;

function validUser (data, user, res) {
  if (data.email === user.email) {
    return success(200, data, res);
  }
  return fail(401,{ error : 'user os password invalid' }, res);
}

function success (status, data, res) {
  if (!data) {
    return fail(401, userNotFound, res);
  }
  res.status(status).json({ token : jwt(data) });
}

function fail (status, err, res) {
  res.status(status).json({ err });
}