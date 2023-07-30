const statusCode = require('http2').constants;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const { handleError } = require('../middlewares/errorHandler');
const { secret } = require('../utils/constants');

// METHOD: GET
const getUsers = (req, res, next) => {
  User.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => handleError(err, next));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => handleError(err, next));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => handleError(err, next));
};

// METHOD: POST
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : secret,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => handleError(err, next));
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((result) => {
      res.status(statusCode.HTTP_STATUS_CREATED).send({
        _id: result._id,
        email: result.email,
        name: result.name,
      });
    })
    .catch((err) => handleError(err, next));
};

// METHOD: PATCH
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => handleError(err, next));
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  login,
  createUser,
  updateUser,
};
