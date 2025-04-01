using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MovieBookingApp.Model;
using MovieBookingApp.Repository;

namespace MovieBookingApp.Services
{
    public class MovieService : IMovieService
    {
        private readonly IMovieRepository _movieRepository;

        public MovieService(IMovieRepository movieRepository)
        {
            _movieRepository = movieRepository;
        }

        public async Task<MovieModel> CreateMovieAsync(MovieModel movie)
        {
            return await _movieRepository.CreateMovieAsync(movie);
        }
        public async Task<MovieModel> CreateMovieAsync(MovieModel movie, IFormFile imageFile)
        {
            if (imageFile != null)
            {
                movie.ImageUrl = await ConvertImageToBase64(imageFile);
            }
            return await _movieRepository.CreateMovieAsync(movie);
        }
        public async Task<MovieModel> GetMovieByIdAsync(ObjectId movieId)
        {
            

            return await _movieRepository.GetMovieByIdAsync(movieId);
        }

        public async Task<MovieModel> GetMovieByTitleAsync(string title)
        {
            return await _movieRepository.FindMovieByTitleAsync(title); 
        }

        public async Task<List<MovieModel>> GetAllMoviesAsync()
        {
            return await _movieRepository.GetAllMoviesAsync();
        }

        public async Task<List<MovieModel>> GetMoviesByGenreAsync(string genre)
        {
            return await _movieRepository.GetMoviesByGenreAsync(genre);
        }

        public async Task<bool> UpdateMovieAsync(ObjectId id, MovieModel movie)
        {
            return await _movieRepository.UpdateMovieAsync(id, movie);
        }
        public async Task<bool> UpdateMovieAsync(ObjectId id, MovieModel movie, IFormFile imageFile)
        {
            if (imageFile != null)
            {
                movie.ImageUrl = await ConvertImageToBase64(imageFile);
            }
            return await _movieRepository.UpdateMovieAsync(id, movie);
        }
        public async Task<bool> DeleteMovieAsync(ObjectId id)
        {
            return await _movieRepository.DeleteMovieAsync(id);
        }

        private async Task<string> ConvertImageToBase64(IFormFile imageFile)
        {
            using (var memoryStream = new MemoryStream())
            {
                await imageFile.CopyToAsync(memoryStream);
                byte[] imageBytes = memoryStream.ToArray();
                return Convert.ToBase64String(imageBytes);
            }
        }

        public async Task<bool> AddMovieAsync(MovieModel movie)
        {
            var result = await _movieRepository.CreateMovieAsync(movie);
            return result != null;
        }
    }
}
