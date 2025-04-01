using Moq;
using NUnit.Framework;
using MovieBookingApp.Controllers;
using MovieBookingApp.Services;
using Microsoft.AspNetCore.Mvc;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace MovieBookingApp.Tests.Controllers
{
    [TestFixture]
    public class FavoriteControllerTests
    {
        private Mock<IFavoriteService> _mockFavoriteService;
        private FavoriteController _favoriteController;

        [SetUp]
        public void Setup()
        {
            _mockFavoriteService = new Mock<IFavoriteService>();
            _favoriteController = new FavoriteController(_mockFavoriteService.Object);
        }

        [Test]
        public async Task GetFavoritesByUserId_ShouldReturnOk_WithFavorites()
        {
            string userId = ObjectId.GenerateNewId().ToString();
            var favorites = new List<FavoriteModel>
            {
                new FavoriteModel { UserId = userId, MovieId = ObjectId.GenerateNewId().ToString(), MovieTitle = "Movie1" }
            };

            _mockFavoriteService.Setup(service => service.GetFavoritesByUserIdAsync(userId))
                                .ReturnsAsync(favorites);
            var result = await _favoriteController.GetFavoritesByUserId(userId) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.IsNotNull(result.Value);
        }

        [Test]
        public async Task AddMovieToFavorites_ShouldReturnOk_WhenMovieIsAdded()
        {
            string userId = ObjectId.GenerateNewId().ToString();
            var favoriteModel = new FavoriteModel { MovieId = ObjectId.GenerateNewId().ToString() };

            _mockFavoriteService.Setup(service => service.AddToUserFavoritesAsync(userId, favoriteModel.MovieId))
                                .ReturnsAsync(true);
            var result = await _favoriteController.AddMovieToFavorites(userId, favoriteModel) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task AddMovieToFavorites_ShouldReturnBadRequest_WhenMovieIdIsInvalid()
        {
            string userId = ObjectId.GenerateNewId().ToString();
            var favoriteModel = new FavoriteModel { MovieId = "invalidMovieId" };
            var result = await _favoriteController.AddMovieToFavorites(userId, favoriteModel) as BadRequestObjectResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task RemoveFromFavorites_ShouldReturnOk_WhenMovieIsRemoved()
        {
            string userId = ObjectId.GenerateNewId().ToString();
            string movieId = ObjectId.GenerateNewId().ToString();

            _mockFavoriteService.Setup(service => service.RemoveFromFavoritesAsync(userId, movieId))
                                .ReturnsAsync(true);
            var result = await _favoriteController.RemoveFromFavorites(userId, movieId) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public async Task RemoveFromFavorites_ShouldReturnNotFound_WhenMovieIsNotInFavorites()
        {
            string userId = ObjectId.GenerateNewId().ToString();
            string movieId = ObjectId.GenerateNewId().ToString();

            _mockFavoriteService.Setup(service => service.RemoveFromFavoritesAsync(userId, movieId))
                                .ReturnsAsync(false);
            var result = await _favoriteController.RemoveFromFavorites(userId, movieId) as NotFoundObjectResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
        }
    }
}
