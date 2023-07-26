const statusCode = require('http2').constants;

const Card = require('../models/card');
const errorHandler = require('../middlewares/error-handler');
const ForbiddenError = require('../errors/ForbiddenError');

// METHOD: GET
module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => errorHandler(err, next));
};

module.exports.getCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => errorHandler(err, next));
};

// METHOD: POST
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((result) => {
      res.status(statusCode.HTTP_STATUS_CREATED).send(result);
    })
    .catch((err) => errorHandler(err, next));
};

// METHOD: DELETE
module.exports.deleteCard = (req, res, next) => {
  const currentUserId = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((result) => {
      if (String(result.owner) !== currentUserId) {
        return Promise.reject(new ForbiddenError('Удалять чужие карточки запрещено.'));
      }
      return Card.findByIdAndRemove(cardId)
        .orFail()
        .then((removedResult) => res.send(removedResult))
        .catch((err) => errorHandler(err, next));
    })
    .catch((err) => errorHandler(err, next));
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => errorHandler(err, next));
};

// METHOD: PUT
module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => errorHandler(err, next));
};
