using Moq;
using NUnit.Framework;
using MovieBookingApp.Services;
using MovieBookingApp.Repository;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace MovieBookingApp.Tests.Services
{
    [TestFixture]
    public class FavoriteServiceTests
    {
        private Mock<IFavoriteRepository> _mockFavoriteRepository;
        private Mock<IMovieService> _mockMovieService;
        private FavoriteService _favoriteService;

        [SetUp]
        public void Setup()
        {
            _mockFavoriteRepository = new Mock<IFavoriteRepository>();
            _mockMovieService = new Mock<IMovieService>();
            _favoriteService = new FavoriteService(_mockFavoriteRepository.Object, _mockMovieService.Object);
        }

        [Test]
        public async Task GetFavoritesByUserIdAsync_ShouldReturnFavorites()
        {
            string userId = ObjectId.GenerateNewId().ToString();
            var favorites = new List<FavoriteModel>
            {
                new FavoriteModel { UserId = userId, MovieId = ObjectId.GenerateNewId().ToString() }
            };

            _mockFavoriteRepository.Setup(repo => repo.GetFavoritesByUserIdAsync(userId))
                                   .ReturnsAsync(favorites);
            var result = await _favoriteService.GetFavoritesByUserIdAsync(userId);
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task AddToUserFavoritesAsync_ShouldReturnTrue_WhenMovieIsAdded()
        {
            string userId = ObjectId.GenerateNewId().ToString();
            string movieId = ObjectId.GenerateNewId().ToString();
            var movie = new MovieModel { Id = new ObjectId(movieId), Title = "Movie Title", ImageUrl = "image.jpg" };

            _mockFavoriteRepository.Setup(repo => repo.GetFavoritesByUserIdAsync(userId))
                                   .ReturnsAsync(new List<FavoriteModel>());

            _mockMovieService.Setup(service => service.GetMovieByIdAsync(It.IsAny<ObjectId>()))
                             .ReturnsAsync(movie);

            _mockFavoriteRepository.Setup(repo => repo.AddToFavoritesAsync(It.IsAny<FavoriteModel>()))
                                   .ReturnsAsync(true);
            var result = await _favoriteService.AddToUserFavoritesAsync(userId, movieId);
            Assert.IsTrue(result);
        }

        [Test]
        public async Task AddToUserFavoritesAsync_ShouldReturnFalse_WhenMovieAlreadyExists()
        {
            string userId = ObjectId.GenerateNewId().ToString();
            string movieId = ObjectId.GenerateNewId().ToString();
            var existingFavorites = new List<FavoriteModel> { new FavoriteModel { UserId = userId, MovieId = movieId } };

            _mockFavoriteRepository.Setup(repo => repo.GetFavoritesByUserIdAsync(userId))
                                   .ReturnsAsync(existingFavorites);

            var result = await _favoriteService.AddToUserFavoritesAsync(userId, movieId);
            Assert.IsFalse(result);
        }

        [Test]
        public async Task RemoveFromFavoritesAsync_ShouldReturnTrue_WhenMovieIsRemoved()
        {
            string userId = ObjectId.GenerateNewId().ToString();
            string movieId = ObjectId.GenerateNewId().ToString();
            _mockFavoriteRepository.Setup(repo => repo.RemoveFromUserFavoritesAsync(userId, movieId))
                                   .ReturnsAsync(true);
            var result = await _favoriteService.RemoveFromFavoritesAsync(userId, movieId);
            Assert.IsTrue(result);
        }
    }
}
