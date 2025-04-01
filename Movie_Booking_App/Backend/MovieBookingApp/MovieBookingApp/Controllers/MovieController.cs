using Microsoft.AspNetCore.Mvc;
using MovieBookingApp.Model;
using MovieBookingApp.Services;
using MongoDB.Bson;
using Microsoft.AspNetCore.Authorization;


namespace MovieBookingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly IMovieService _movieService;
        private readonly string _imageDirectory;

        public MovieController(IMovieService movieService)
        {
            _movieService = movieService;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetMovies()
        {
            var movies = await _movieService.GetAllMoviesAsync();

            if (movies == null || !movies.Any())
                return NoContent();

            var moviesWithStringIds = movies.Select(movie => new
            {
                Id = movie.Id.ToString(),  
                Title = movie.Title,
                Description = movie.Description,
                Genres = movie.Genres,
                ReleaseDate = movie.ReleaseDate,
                ImageUrl = movie.ImageUrl
            });

            return Ok(moviesWithStringIds);
        }

        [HttpGet("id")]
        public async Task<IActionResult> GetMovieById([FromQuery] string id)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return BadRequest("Invalid ObjectId format.");
            }

            var movie = await _movieService.GetMovieByIdAsync(objectId);
            if (movie == null)
            {
                return NotFound("Movie not found.");
            }
            var movieDto = new
            {
                Id = movie.Id.ToString(),  
                Title = movie.Title,
                ImageUrl = movie.ImageUrl,
                Genres = movie.Genres,
                Description = movie.Description,
                
            };

            return Ok(movieDto);
        }



        [HttpGet("title")]
        public async Task<IActionResult> GetMovieByTitle([FromQuery] string title)
        {
            if (string.IsNullOrEmpty(title))
                return NoContent();

            var movie = await _movieService.GetMovieByTitleAsync(title);
            if (movie == null)
                return NotFound();

            return Ok(new
            {
                Id = movie.Id.ToString(),
                Title = movie.Title,
                Description = movie.Description,
                Genres = movie.Genres,
                ReleaseDate = movie.ReleaseDate,
                ImageUrl = movie.ImageUrl
            });
        }

        
        [HttpGet("genre")]
        public async Task<IActionResult> GetMoviesByGenre([FromQuery] string genre)
        {
            var movies = await _movieService.GetMoviesByGenreAsync(genre);
            return Ok(movies.Select(movie => new
            {
                Id = movie.Id.ToString(),
                Title = movie.Title,
                Description = movie.Description,
                Genres = movie.Genres,
                ReleaseDate = movie.ReleaseDate,
                ImageUrl = movie.ImageUrl
            }));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMovie([FromQuery] string movieId)
        {
            if (!ObjectId.TryParse(movieId, out ObjectId objectId))
                return BadRequest("Invalid Movie ID format.");

            bool valid = await _movieService.DeleteMovieAsync(objectId);
            if (valid)
                return Ok("Movie deleted successfully.");

            return BadRequest("Failed to delete the movie.");
        }

        [HttpPost]
        public async Task<IActionResult> AddMovie(
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] string releaseDate,
            [FromForm] string status,
            [FromForm] string genres,
            [FromForm] IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("Image file is required.");
            }

            var movie = new MovieModel
            {
                Id = ObjectId.GenerateNewId(),
                Title = title,
                Description = description,
                ReleaseDate = DateTime.Parse(releaseDate),
                Status = status,
                Genres = genres.Split(',').Select(g => new GenreModel { Name = g.Trim() }).ToList()
            };

            var createdMovie = await _movieService.CreateMovieAsync(movie, imageFile);
            return createdMovie != null ? Ok("Movie added successfully.") : BadRequest("Failed to add movie.");
        }

        [HttpPut]
        public async Task<IActionResult> UpdateMovie(
            [FromForm] string id,
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] string releaseDate,
            [FromForm] string status,
            [FromForm] string? genres,
            [FromForm] IFormFile? imageFile)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
                return BadRequest("Invalid Movie ID format.");

            var existingMovie = await _movieService.GetMovieByIdAsync(objectId);
            if (existingMovie == null)
                return NotFound("Movie not found.");

            var updatedMovie = new MovieModel
            {
                Id = objectId,
                Title = title,
                Description = description,
                ReleaseDate = DateTime.TryParse(releaseDate, out DateTime parsedDate) ? parsedDate : existingMovie.ReleaseDate,
                Status = status,
                Genres = string.IsNullOrEmpty(genres)
                    ? existingMovie.Genres
                    : genres.Split(',').Select(g => new GenreModel { Name = g.Trim() }).ToList(),
                ImageUrl = existingMovie.ImageUrl 
            };

            bool updated;
            if (imageFile != null)
            {
                updated = await _movieService.UpdateMovieAsync(objectId, updatedMovie, imageFile);
            }
            else
            {
                updated = await _movieService.UpdateMovieAsync(objectId, updatedMovie);
            }

            return updated ? Ok("Movie updated successfully.") : BadRequest("Failed to update movie.");
        }

    }
}
