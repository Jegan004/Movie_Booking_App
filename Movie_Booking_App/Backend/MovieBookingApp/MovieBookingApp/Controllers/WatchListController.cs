using Microsoft.AspNetCore.Mvc;
using MovieBookingApp.Services;
using MovieBookingApp.Model;
using System;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace MovieBookingApp.Controllers
{
    [Route("api/watchlist")]
    [ApiController]
    public class WatchListController : ControllerBase
    {
        private readonly IWatchListService _watchListService;

        public WatchListController(IWatchListService watchListService)
        {
            _watchListService = watchListService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWatchListByUserId([FromRoute] string userId)
        {
            if (!ObjectId.TryParse(userId, out _))
                return BadRequest("Invalid user ID format.");

            var watchList = await _watchListService.GetWatchListByUserIdAsync(userId);
            return Ok(watchList);
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> AddMovieToWatchlist([FromRoute] string userId, [FromBody] WatchListModel watchlistModel)
        {
            try
            {
                if (!ObjectId.TryParse(userId, out _))
                    return BadRequest("Invalid user ID format.");

                if (string.IsNullOrEmpty(watchlistModel.MovieId) || !ObjectId.TryParse(watchlistModel.MovieId, out _))
                    return BadRequest("Valid MovieId is required.");

                var result = await _watchListService.AddToUserWatchlistAsync(userId, watchlistModel.MovieId);
                if (result)
                {
                    return Ok("Movie added to watchlist.");
                }
                else
                {
                    return StatusCode(500, "Failed to add movie to watchlist.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{userId}/{movieId}")]
        public async Task<IActionResult> RemoveFromWatchList([FromRoute] string userId, [FromRoute] string movieId)
        {
            if (!ObjectId.TryParse(userId, out _))
                return BadRequest("Invalid user ID format.");

            if (!ObjectId.TryParse(movieId, out _))
                return BadRequest("Invalid movie ID format.");

            var isRemoved = await _watchListService.RemoveFromWatchListAsync(userId, movieId);

            if (!isRemoved)
                return NotFound("Movie not found in watchlist.");

            return Ok("Movie removed from watchlist." );
        }
    }
}
