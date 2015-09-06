/**
 * Created by fourq on 9/3/15.
 */
'use strict';

angular.module('moo-v.common')
  .service('MoviesModel', function ($http, ROTTEN_TOMATOES_API, OMDB_API) {
    var service = this;

    function extractMovieListData(result) {
      return _.map(result.data.movies, function (movie) {
        return {
          title: movie.title,
          year: movie.year,
          rating: movie.mpaa_rating,
          image: movie.posters.thumbnail
        };
      });
    }

    function extractMovieData(result) {
      if (result.data.imdbRating) {
        result.data.imdbRating = Math.round(result.data.imdbRating);
      }

      if (result.data.Response === 'False') {
        result.data.Poster = 'http://img4.wikia.nocookie.net/__cb20120318034910/glee/images/a/a0/Y-u-no.png';
        result.data.Title = '   No Information Found at OMDB';
        result.data.Director = 'N/A';
        result.data.Writer = 'N/A';
        result.data.Actors = 'N/A';
        result.data.Language = 'N/A';
      }

      return result.data;
    }

    function getMoviesListUrl() {
      return ROTTEN_TOMATOES_API.URI + ROTTEN_TOMATOES_API.IN_THEATERS_LIST_URI_PATH;
    }

    function getUrlForId(movieId) {
      return (OMDB_API.URI + OMDB_API.SEARCH_BY_ID_URI_PATH)
        .replace('{ID}', movieId);
    }

    function getUrlForTitle(movieTitle, movieYear) {
      if (!movieYear) {
        movieYear = '';
      }

      return (OMDB_API.URI + OMDB_API.SEARCH_BY_TITLE_URI_PATH)
        .replace('{TITLE}', movieTitle)
        .replace('{YEAR}', movieYear);
    }

    service.fetchList = function () {
      return $http.jsonp(getMoviesListUrl()).then(extractMovieListData);
    };

    service.fetchById = function (movieId) {
      return $http.jsonp(getUrlForId(movieId)).then(extractMovieData);
    };

    service.fetchByTitle = function (movieTitle) {
      return $http.jsonp(getUrlForTitle(movieTitle)).then(extractMovieData);
    };

    service.fetchByTitleAndYear = function (movieTitle, movieYear) {
      return $http.jsonp(getUrlForTitle(movieTitle, movieYear)).then(extractMovieData);
    };
  });