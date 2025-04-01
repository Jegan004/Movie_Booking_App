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
    public class BookingServiceTests
    {
        private Mock<IBookingRepository> _bookingRepositoryMock;
        private BookingService _bookingService;

        [SetUp]
        public void SetUp()
        {
            _bookingRepositoryMock = new Mock<IBookingRepository>();
            _bookingService = new BookingService(_bookingRepositoryMock.Object);
        }


        [Test]
        public async Task CreateBookingAsync_ReturnsBooking_WhenBookingIsCreated()
        {
            var booking = new BookingModel
            {
                Id = ObjectId.GenerateNewId().ToString(), 
                UserId = ObjectId.GenerateNewId().ToString(),
                Showtime = DateTime.Now, 
                TicketPrice = 10.50,
                TicketCount = 2,
                TotalPrice = 21.00
            };

            _bookingRepositoryMock.Setup(r => r.CreateBookingAsync(It.IsAny<BookingModel>()))
                                  .ReturnsAsync(booking);

            var result = await _bookingService.CreateBookingAsync(booking);

            Assert.IsNotNull(result);
            Assert.AreEqual(booking.UserId, result.UserId);
        }

        [Test]
        public async Task GetBookingByIdAsync_ReturnsBooking_WhenBookingExists()
        {
            var bookingId = ObjectId.GenerateNewId();
            var booking = new BookingModel
            {
                Id = bookingId.ToString(),
                UserId = ObjectId.GenerateNewId().ToString(),
                Showtime = DateTime.Now,
                TicketPrice = 10.50,
                TicketCount = 2,
                TotalPrice = 21.00
            };

            _bookingRepositoryMock.Setup(r => r.GetBookingByIdAsync(bookingId))
                                  .ReturnsAsync(booking);

            var result = await _bookingService.GetBookingByIdAsync(bookingId);

            Assert.IsNotNull(result);
            Assert.AreEqual(bookingId.ToString(), result.Id);
        }

        [Test]
        public async Task GetBookingByIdAsync_ReturnsNull_WhenBookingDoesNotExist()
        {
            var bookingId = ObjectId.GenerateNewId();
            _bookingRepositoryMock.Setup(r => r.GetBookingByIdAsync(bookingId))
                                  .ReturnsAsync((BookingModel)null);

            var result = await _bookingService.GetBookingByIdAsync(bookingId);

            Assert.IsNull(result);
        }

        [Test]
        public async Task GetBookingsByUserIdAsync_ReturnsBookings_WhenBookingsExist()
        {
            var userId = ObjectId.GenerateNewId();
            var bookings = new List<BookingModel>
            {
                new BookingModel
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    UserId = userId.ToString(),
                    Showtime = DateTime.Now,
                    TicketPrice = 10.50,
                    TicketCount = 2,
                    TotalPrice = 21.00
                },
                new BookingModel
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    UserId = userId.ToString(),
                    Showtime = DateTime.Now.AddDays(1),
                    TicketPrice = 12.50,
                    TicketCount = 3,
                    TotalPrice = 37.50
                }
            };

            _bookingRepositoryMock.Setup(r => r.GetBookingsByUserIdAsync(userId))
                                  .ReturnsAsync(bookings);

            var result = await _bookingService.GetBookingsByUserIdAsync(userId);

            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(userId.ToString(), result[0].UserId);
        }

        [Test]
        public async Task GetBookingsByUserIdAsync_ReturnsEmptyList_WhenNoBookingsExist()
        {
            var userId = ObjectId.GenerateNewId();
            _bookingRepositoryMock.Setup(r => r.GetBookingsByUserIdAsync(userId))
                                  .ReturnsAsync(new List<BookingModel>());

            var result = await _bookingService.GetBookingsByUserIdAsync(userId);

            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count);
        }
    }
}
