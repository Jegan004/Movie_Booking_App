using Moq;
using NUnit.Framework;
using MovieBookingApp.Model;
using MovieBookingApp.Repository;
using MovieBookingApp.Services;
using MongoDB.Bson;


namespace MovieBookingApp.Tests.Services
{
    [TestFixture]
    public class WatchListServiceTests
    {
        private Mock<IWatchListRepository> _watchListRepositoryMock;
        private Mock<IMovieService> _movieServiceMock;
        private WatchListService _watchListService;

        [SetUp]
        public void SetUp()
        {
            _watchListRepositoryMock = new Mock<IWatchListRepository>();
            _movieServiceMock = new Mock<IMovieService>();
            _watchListService = new WatchListService(_watchListRepositoryMock.Object, _movieServiceMock.Object);
        }
        [Test]
        public async Task AddToUserWatchlistAsync_ReturnsFalse_WhenMovieIsAlreadyInWatchlist()
        {
            var userId = "validUserId";
            var movieId = "movieId1";

            var existingWatchlistItems = new List<WatchListModel>
            {
                new WatchListModel { MovieId = movieId }
            };

            _watchListRepositoryMock.Setup(repo => repo.GetWatchListByUserIdAsync(userId)).ReturnsAsync(existingWatchlistItems);

            var result = await _watchListService.AddToUserWatchlistAsync(userId, movieId);

            Assert.IsFalse(result);
        }

    }
}
