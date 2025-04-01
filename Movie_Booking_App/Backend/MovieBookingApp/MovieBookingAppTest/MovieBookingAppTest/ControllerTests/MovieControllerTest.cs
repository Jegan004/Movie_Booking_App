using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using MovieBookingApp.Controllers;
using MovieBookingApp.Model;
using MovieBookingApp.Services;
using MongoDB.Bson;
using MovieBookingApp.Services.Interfaces;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MovieBookingApp.Tests.Controllers
{
    [TestFixture]
    public class MovieControllerTests
    {
        private Mock<IMovieService> _mockMovieService;
        private MovieController _controller;

        [SetUp]
        public void Setup()
        {
            _mockMovieService = new Mock<IMovieService>();
            _controller = new MovieController(_mockMovieService.Object);
        }

        [Test]
        public async Task GetMovies_ReturnsNoContent_WhenNoMoviesFound()
        {
            _mockMovieService.Setup(s => s.GetAllMoviesAsync()).ReturnsAsync(new List<MovieModel>());

            var result = await _controller.GetMovies();

            Assert.IsInstanceOf<NoContentResult>(result);
        }

        [Test]
        public async Task GetMovies_ReturnsOk_WhenMoviesFound()
        {
            var movies = new List<MovieModel> { new MovieModel { Id = ObjectId.GenerateNewId(), Title = "Movie 1" } };
            _mockMovieService.Setup(s => s.GetAllMoviesAsync()).ReturnsAsync(movies);

            var result = await _controller.GetMovies() as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task GetMovieById_ReturnsBadRequest_WhenInvalidId()
        {
            var result = await _controller.GetMovieById("invalid_id");

            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task GetMovieById_ReturnsNotFound_WhenMovieNotFound()
        {
            _mockMovieService.Setup(s => s.GetMovieByIdAsync(It.IsAny<ObjectId>())).ReturnsAsync((MovieModel)null);

            var result = await _controller.GetMovieById(ObjectId.GenerateNewId().ToString());

            Assert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task DeleteMovie_ReturnsBadRequest_WhenInvalidId()
        {
            var result = await _controller.DeleteMovie("invalid_id");

            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task DeleteMovie_ReturnsOk_WhenMovieDeleted()
        {
            _mockMovieService.Setup(s => s.DeleteMovieAsync(It.IsAny<ObjectId>())).ReturnsAsync(true);

            var result = await _controller.DeleteMovie(ObjectId.GenerateNewId().ToString()) as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task AddMovie_ReturnsBadRequest_WhenImageFileIsNull()
        {
            var result = await _controller.AddMovie("Title", "Description", "2025-01-01", "Active", "Action", null);

            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task AddMovie_ReturnsOk_WhenMovieAddedSuccessfully()
        {
            _mockMovieService.Setup(s => s.CreateMovieAsync(It.IsAny<MovieModel>(), It.IsAny<IFormFile>()))
                .ReturnsAsync(new MovieModel());

            var formFileMock = new Mock<IFormFile>();
            formFileMock.Setup(f => f.Length).Returns(1);

            var result = await _controller.AddMovie("Title", "Description", "2025-01-01", "Active", "Action", formFileMock.Object) as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }
    }
}