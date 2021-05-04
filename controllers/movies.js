const Movie = require('../models/movie');
const CustomError = require('../utils/errors');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.userId })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner:  req.userId})
    .then((movie) => res.send(movie))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie)
        throw new CustomError(404, "Запрашиваемая карточка не найдена");
      else if (movie.owner.toString() === req.userId)
        return Movie.findByIdAndRemove(movie._id);
      else
        throw new CustomError(
          403,
          "Пользователь не может удалить чужой фильм"
        );
    })
    .then((movie) => res.send(movie))
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie
}