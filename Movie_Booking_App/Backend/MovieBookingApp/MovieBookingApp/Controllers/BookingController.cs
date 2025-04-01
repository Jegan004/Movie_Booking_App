using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MovieBookingApp.Model;
using MovieBookingApp.Services;
using System;
using System.Threading.Tasks;

namespace MovieBookingApp.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IMovieService _movieService;

        public BookingController(IBookingService bookingService,IMovieService movieService)
        {
            _bookingService = bookingService;
            _movieService = movieService;
        }


        [HttpPost("{userId}")]
        public async Task<IActionResult> CreateBooking([FromRoute] string userId, [FromBody] BookingModel booking)
        {
            try
            {
                if (booking == null)
                    return BadRequest("Booking data is required.");

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(booking.MovieId))
                    return BadRequest("UserId and MovieId are required.");

                if (!ObjectId.TryParse(userId, out ObjectId userObjectId) ||
                    !ObjectId.TryParse(booking.MovieId, out ObjectId movieObjectId))
                {
                    return BadRequest("Invalid UserId or MovieId format.");
                }

                if (booking.TicketCount <= 0)
                    return BadRequest("Ticket count must be at least 1.");


                double expectedTotalPrice = booking.TicketCount * booking.TicketPrice;
                if (Math.Abs(booking.TotalPrice - expectedTotalPrice) > 0.01)
                {
                    return BadRequest($"Total price mismatch. Expected: {expectedTotalPrice}, Received: {booking.TotalPrice}");
                }



                booking.UserId = userId;
                booking.MovieId = movieObjectId.ToString();
                booking.Showtime = booking.Showtime.ToUniversalTime();

                //Console.WriteLine($"[DEBUG] Showtime received: {booking.Showtime}");
                var createdBooking = await _bookingService.CreateBookingAsync(booking);
                return CreatedAtAction(nameof(GetBookingById), new { id = createdBooking.Id }, createdBooking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById([FromRoute] string id)
        {
            try
            {
                if (!ObjectId.TryParse(id, out ObjectId bookingId))
                    return BadRequest("Invalid booking ID format.");

                var booking = await _bookingService.GetBookingByIdAsync(bookingId);
                if (booking == null)
                    return NotFound("Booking not found.");

                return Ok(booking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetBookingsByUserId([FromRoute] string userId)
        {
            try
            {
                if (!ObjectId.TryParse(userId, out ObjectId userObjectId))
                    return BadRequest("Invalid user ID format.");

                var bookings = await _bookingService.GetBookingsByUserIdAsync(userObjectId);

                if (bookings == null || bookings.Count == 0)
                    return NotFound("No bookings found.");

                var bookingsWithMovieDetails = new List<object>();

                foreach (var booking in bookings)
                {
                    Console.WriteLine($"[DEBUG] Retrieved Booking Showtime: {booking.Showtime}");

                    if (!ObjectId.TryParse(booking.MovieId, out ObjectId movieObjectId))
                        return BadRequest("Invalid MovieId format.");

                    var movie = await _movieService.GetMovieByIdAsync(movieObjectId);

                    if (movie != null)
                    {
                        string formattedShowtime = booking.Showtime != default(DateTime)? booking.Showtime.ToString("o")
                            : null;

                        bookingsWithMovieDetails.Add(new
                        {
                            Id = booking.Id,
                            MovieId = booking.MovieId,
                            MovieTitle = movie.Title,
                            MovieImage = movie.ImageUrl,
                            Showtime = formattedShowtime ?? "TBD", 
                            TicketCount = booking.TicketCount,
                            TotalPrice = booking.TotalPrice
                        });
                    }
                }

                return Ok(bookingsWithMovieDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}
