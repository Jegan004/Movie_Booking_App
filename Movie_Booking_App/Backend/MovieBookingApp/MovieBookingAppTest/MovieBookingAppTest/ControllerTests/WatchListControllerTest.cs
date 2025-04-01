using Microsoft.AspNetCore.Mvc;
using Moq;
using MovieBookingApp.Controllers;
using MovieBookingApp.Model;
using MovieBookingApp.Services;
using MovieBookingApp.Services.Interfaces;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Tests.ControllerTests
{
    [TestFixture]
    public class WatchListControllerTests
    {
        private Mock<IWatchListService> _watchListServiceMock;
        private WatchListController _controller;

        [SetUp]
        public void Setup()
        {
            _watchListServiceMock = new Mock<IWatchListService>();
            _controller = new WatchListController(_watchListServiceMock.Object);
        }

        [Test]
        public async Task GetWatchListByUserId_ReturnsOk_WhenUserHasWatchList()
        {

            var userId = "507f1f77bcf86cd799439022";
            var watchList = new List<WatchListModel>
            {
                new WatchListModel { MovieId = "507f1f77bcf86cd799439023" },
                new WatchListModel { MovieId = "507f1f77bcf86cd799439024" }
            };

            _watchListServiceMock.Setup(service => service.GetWatchListByUserIdAsync(userId))
                                 .ReturnsAsync(watchList);


            var result = await _controller.GetWatchListByUserId(userId) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            var returnedWatchList = result.Value as List<WatchListModel>;
            Assert.IsNotNull(returnedWatchList);
            Assert.AreEqual(2, returnedWatchList.Count);
        }

        [Test]
        public async Task AddMovieToWatchlist_ReturnsOk_WhenMovieIsAddedSuccessfully()
        {
            var userId = "507f1f77bcf86cd799439022";
            var watchListModel = new WatchListModel { MovieId = "507f1f77bcf86cd799439025" };

            _watchListServiceMock.Setup(service => service.AddToUserWatchlistAsync(userId, watchListModel.MovieId))
                                 .ReturnsAsync(true);

            var result = await _controller.AddMovieToWatchlist(userId, watchListModel) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual("Movie added to watchlist.", result.Value);
        }

        [Test]
        public async Task AddMovieToWatchlist_ReturnsBadRequest_WhenMovieIdIsInvalid()
        {
            var userId = "507f1f77bcf86cd799439022";
            var watchListModel = new WatchListModel { MovieId = "invalid-movie-id" };
            var result = await _controller.AddMovieToWatchlist(userId, watchListModel) as BadRequestObjectResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Valid MovieId is required.", result.Value);
        }

        [Test]
        public async Task RemoveFromWatchList_ReturnsOk_WhenMovieIsRemovedSuccessfully()
        {
            var userId = "507f1f77bcf86cd799439022";
            var movieId = "507f1f77bcf86cd799439025";
            _watchListServiceMock.Setup(service => service.RemoveFromWatchListAsync(userId, movieId))
                                 .ReturnsAsync(true);
            var result = await _controller.RemoveFromWatchList(userId, movieId) as OkObjectResult;
            Assert.IsNotNull(result);

            Assert.AreEqual(200, result.StatusCode);

        }



        [Test]
        public async Task RemoveFromWatchList_ReturnsNotFound_WhenMovieIsNotFoundInWatchlist()
        {
            var userId = "507f1f77bcf86cd799439022";
            var movieId = "507f1f77bcf86cd799439025";

            _watchListServiceMock.Setup(service => service.RemoveFromWatchListAsync(userId, movieId))
                                 .ReturnsAsync(false);

            var result = await _controller.RemoveFromWatchList(userId, movieId) as NotFoundObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Movie not found in watchlist.", result.Value);
        }

        [Test]
        public async Task GetWatchListByUserId_ReturnsBadRequest_WhenUserIdIsInvalid()
        {
            var userId = "invalid-user-id";


            var result = await _controller.GetWatchListByUserId(userId) as BadRequestObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Invalid user ID format.", result.Value);
        }
    }
}
