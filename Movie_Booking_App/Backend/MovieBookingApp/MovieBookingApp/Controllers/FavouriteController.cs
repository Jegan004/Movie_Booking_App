using Microsoft.AspNetCore.Mvc;
using MovieBookingApp.Services;
using MovieBookingApp.Model;
using System;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace MovieBookingApp.Controllers
{
    [Route("api/favorites")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetFavoritesByUserId([FromRoute] string userId)
        {
            if (!ObjectId.TryParse(userId, out _))
                return BadRequest("Invalid user ID format.");

            var favorites = await _favoriteService.GetFavoritesByUserIdAsync(userId);
            return Ok(favorites);
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> AddMovieToFavorites([FromRoute] string userId, [FromBody] FavoriteModel favoriteModel)
        {
            try
            {
                if (!ObjectId.TryParse(userId, out _))
                    return BadRequest("Invalid user ID format.");

                if (string.IsNullOrEmpty(favoriteModel.MovieId) || !ObjectId.TryParse(favoriteModel.MovieId, out _))
                    return BadRequest("Valid MovieId is required.");

                var result = await _favoriteService.AddToUserFavoritesAsync(userId, favoriteModel.MovieId);
                if (result)
                {
                    return Ok("Movie added to favorites.");
                }
                else
                {
                    return StatusCode(500, "Failed to add movie to favorites.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{userId}/{movieId}")]
        public async Task<IActionResult> RemoveFromFavorites([FromRoute] string userId, [FromRoute] string movieId)
        {
            if (!ObjectId.TryParse(userId, out _))
                return BadRequest("Invalid user ID format.");

            if (!ObjectId.TryParse(movieId, out _))
                return BadRequest("Invalid movie ID format.");

            var isRemoved = await _favoriteService.RemoveFromFavoritesAsync(userId, movieId);

            if (!isRemoved)
                return NotFound("Movie not found in favorites.");

            return Ok("Movie removed from favorites.");
        }
    }
}
