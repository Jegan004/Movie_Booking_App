using Moq;
using NUnit.Framework;
using MovieBookingApp.Services;
using MovieBookingApp.Repository;
using MovieBookingApp.Model;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Tests.Services
{
    [TestFixture]
    public class MovieServiceTests
    {
        private Mock<IMovieRepository> _movieRepositoryMock;
        private MovieService _movieService;

        [SetUp]
        public void SetUp()
        {
            _movieRepositoryMock = new Mock<IMovieRepository>();
            _movieService = new MovieService(_movieRepositoryMock.Object);
        }

        [Test]
        public async Task CreateMovieAsync_ReturnsMovie_WhenMovieIsCreated()
        {
            var movie = new MovieModel
            {
                Id = ObjectId.GenerateNewId(),
                Title = "Movie 1",
                Description = "Action movie",
                ReleaseDate = DateTime.Now,
                Status = "Released",
                Genres = new List<GenreModel>
                {
                    new GenreModel { Name = "Action" }
                },
                ImageUrl = "http://example.com/movie1.jpg"
            };

            _movieRepositoryMock.Setup(r => r.CreateMovieAsync(It.IsAny<MovieModel>()))
                                .ReturnsAsync(movie);

            var result = await _movieService.CreateMovieAsync(movie);

            Assert.IsNotNull(result);
            Assert.AreEqual(movie.Title, result.Title);
            Assert.AreEqual(movie.Description, result.Description);
        }

        [Test]
        public async Task GetMovieByIdAsync_ReturnsMovie_WhenMovieExists()
        {
            var movieId = ObjectId.GenerateNewId();
            var movie = new MovieModel
            {
                Id = movieId,
                Title = "Movie 1",
                Description = "Action movie",
                ReleaseDate = DateTime.Now,
                Status = "Released",
                Genres = new List<GenreModel>
                {
                    new GenreModel { Name = "Action" }
                },
                ImageUrl = "http://example.com/movie1.jpg"
            };

            _movieRepositoryMock.Setup(r => r.GetMovieByIdAsync(movieId))
                                .ReturnsAsync(movie);

            var result = await _movieService.GetMovieByIdAsync(movieId);

            Assert.IsNotNull(result);
            Assert.AreEqual(movieId, result.Id);
            Assert.AreEqual(movie.Title, result.Title);
        }

        [Test]
        public async Task GetMovieByIdAsync_ReturnsNull_WhenMovieDoesNotExist()
        {
            var movieId = ObjectId.GenerateNewId();
            _movieRepositoryMock.Setup(r => r.GetMovieByIdAsync(movieId))
                                .ReturnsAsync((MovieModel)null);

            var result = await _movieService.GetMovieByIdAsync(movieId);

            Assert.IsNull(result);
        }

        [Test]
        public async Task GetMovieByTitleAsync_ReturnsMovie_WhenMovieExists()
        {
            var movieTitle = "Movie 1";
            var movie = new MovieModel
            {
                Id = ObjectId.GenerateNewId(),
                Title = movieTitle,
                Description = "Action movie",
                ReleaseDate = DateTime.Now,
                Status = "Released",
                Genres = new List<GenreModel>
                {
                    new GenreModel { Name = "Action" }
                },
                ImageUrl = "http://example.com/movie1.jpg"
            };

            _movieRepositoryMock.Setup(r => r.FindMovieByTitleAsync(movieTitle))
                                .ReturnsAsync(movie);

            var result = await _movieService.GetMovieByTitleAsync(movieTitle);

            Assert.IsNotNull(result);
            Assert.AreEqual(movieTitle, result.Title);
        }

        [Test]
        public async Task GetMovieByTitleAsync_ReturnsNull_WhenMovieDoesNotExist()
        {
            var movieTitle = "NonExistent Movie";
            _movieRepositoryMock.Setup(r => r.FindMovieByTitleAsync(movieTitle))
                                .ReturnsAsync((MovieModel)null);

            var result = await _movieService.GetMovieByTitleAsync(movieTitle);

            Assert.IsNull(result);
        }

        [Test]
        public async Task GetAllMoviesAsync_ReturnsMovies_WhenMoviesExist()
        {
            var movies = new List<MovieModel>
            {
                new MovieModel
                {
                    Id = ObjectId.GenerateNewId(),
                    Title = "Movie 1",
                    Description = "Action movie",
                    ReleaseDate = DateTime.Now,
                    Status = "Released",
                    Genres = new List<GenreModel>
                    {
                        new GenreModel { Name = "Action" }
                    },
                    ImageUrl = "http://example.com/movie1.jpg"
                },
                new MovieModel
                {
                    Id = ObjectId.GenerateNewId(),
                    Title = "Movie 2",
                    Description = "Drama movie",
                    ReleaseDate = DateTime.Now.AddDays(1),
                    Status = "Released",
                    Genres = new List<GenreModel>
                    {
                        new GenreModel { Name = "Drama" }
                    },
                    ImageUrl = "http://example.com/movie2.jpg"
                }
            };

            _movieRepositoryMock.Setup(r => r.GetAllMoviesAsync())
                                .ReturnsAsync(movies);

            var result = await _movieService.GetAllMoviesAsync();

            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
        }

        [Test]
        public async Task GetAllMoviesAsync_ReturnsEmptyList_WhenNoMoviesExist()
        {
            _movieRepositoryMock.Setup(r => r.GetAllMoviesAsync())
                                .ReturnsAsync(new List<MovieModel>());

            var result = await _movieService.GetAllMoviesAsync();

            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count);
        }
    }
}
