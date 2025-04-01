using Microsoft.AspNetCore.Mvc;
using Moq;
using MovieBookingApp.Controllers;
using MovieBookingApp.Model;
using MovieBookingApp.Services;
using MongoDB.Bson;


namespace MovieBookingApp.Tests.ControllerTests
{
    [TestFixture]
    public class BookingControllerTests
    {
        private Mock<IBookingService> _bookingServiceMock;
        private Mock<IMovieService> _movieServiceMock;
        private BookingController _controller;

        [SetUp]
        public void Setup()
        {
            _bookingServiceMock = new Mock<IBookingService>();
            _movieServiceMock = new Mock<IMovieService>();
            _controller = new BookingController(_bookingServiceMock.Object, _movieServiceMock.Object);
        }

        [Test]
        public async Task CreateBooking_ValidBooking_ReturnsCreatedAtAction()
        {
            var userId = ObjectId.GenerateNewId().ToString();
            var movieId = ObjectId.GenerateNewId().ToString();
            var booking = new BookingModel
            {
                MovieId = movieId,
                TicketCount = 2,
                TicketPrice = 190,
                TotalPrice = 380,
                Showtime = DateTime.UtcNow
            };

            var createdBooking = new BookingModel { Id = ObjectId.GenerateNewId().ToString() };

            _bookingServiceMock
                .Setup(s => s.CreateBookingAsync(It.IsAny<BookingModel>()))
                .ReturnsAsync(createdBooking);

            var result = await _controller.CreateBooking(userId, booking) as CreatedAtActionResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(201, result.StatusCode);
            Assert.AreEqual(createdBooking, result.Value);
        }

        [Test]
        public async Task CreateBooking_InvalidUserId_ReturnsBadRequest()
        {
            var booking = new BookingModel { MovieId = ObjectId.GenerateNewId().ToString(), TicketCount = 2, TicketPrice = 190, TotalPrice = 380 };
            string invalidUserId = "invalid";

            var result = await _controller.CreateBooking(invalidUserId, booking) as BadRequestObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task CreateBooking_MissingMovieId_ReturnsBadRequest()
        {
            var userId = ObjectId.GenerateNewId().ToString();
            var booking = new BookingModel { TicketCount = 2, TicketPrice = 190, TotalPrice = 380 };

            var result = await _controller.CreateBooking(userId, booking) as BadRequestObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task GetBookingById_ValidId_ReturnsOk()
        {
            var bookingId = ObjectId.GenerateNewId();
            var booking = new BookingModel { Id = bookingId.ToString() };

            _bookingServiceMock
                .Setup(s => s.GetBookingByIdAsync(bookingId))
                .ReturnsAsync(booking);

            var result = await _controller.GetBookingById(bookingId.ToString()) as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual(booking, result.Value);
        }

        [Test]
        public async Task GetBookingById_InvalidId_ReturnsBadRequest()
        {
            string invalidBookingId = "invalid";

            var result = await _controller.GetBookingById(invalidBookingId) as BadRequestObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task GetBookingById_NotFound_ReturnsNotFound()
        {
            var bookingId = ObjectId.GenerateNewId();
            _bookingServiceMock
                .Setup(s => s.GetBookingByIdAsync(bookingId))
                .ReturnsAsync((BookingModel)null);

            var result = await _controller.GetBookingById(bookingId.ToString()) as NotFoundObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
        }

        [Test]
        public async Task GetBookingsByUserId_ValidUser_ReturnsOkWithBookings()
        {
            var userId = ObjectId.GenerateNewId().ToString().ToString();
            var bookings = new List<BookingModel>
            {
                new BookingModel { Id = ObjectId.GenerateNewId().ToString(), MovieId = ObjectId.GenerateNewId().ToString(), TicketCount = 2, TotalPrice = 380 },
                new BookingModel { Id = ObjectId.GenerateNewId().ToString(), MovieId = ObjectId.GenerateNewId().ToString(), TicketCount = 3, TotalPrice = 570 }
            };

            var movie = new MovieModel { Title = "Test Movie", ImageUrl = "test.jpg" };

            _bookingServiceMock
                .Setup(s => s.GetBookingsByUserIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync(bookings);

            _movieServiceMock
                .Setup(s => s.GetMovieByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync(movie);

            var result = await _controller.GetBookingsByUserId(userId) as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);

            var responseList = result.Value as List<object>;
            Assert.IsNotNull(responseList);
            Assert.AreEqual(2, responseList.Count);
        }

        [Test]
        public async Task GetBookingsByUserId_InvalidUserId_ReturnsBadRequest()
        {
            string invalidUserId = "invalid";

            var result = await _controller.GetBookingsByUserId(invalidUserId) as BadRequestObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public async Task GetBookingsByUserId_NoBookings_ReturnsNotFound()
        {
            var userId = ObjectId.GenerateNewId();
            _bookingServiceMock
                .Setup(s => s.GetBookingsByUserIdAsync(userId))
                .ReturnsAsync(new List<BookingModel>());

            var result = await _controller.GetBookingsByUserId(userId.ToString()) as NotFoundObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
        }
    }
}
