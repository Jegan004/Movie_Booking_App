using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MovieBookingApp.Model;

namespace MovieBookingApp.Services
{
    public interface IMovieService
    {
        Task<MovieModel> CreateMovieAsync(MovieModel movie);
        Task<MovieModel> CreateMovieAsync(MovieModel movie, IFormFile imageFile);
        Task<MovieModel> GetMovieByIdAsync(ObjectId id);
        Task<List<MovieModel>> GetAllMoviesAsync();
        Task<MovieModel> GetMovieByTitleAsync(string title);
        Task<List<MovieModel>> GetMoviesByGenreAsync(string genre);
        Task<bool> UpdateMovieAsync(ObjectId id, MovieModel movie);
        Task<bool> UpdateMovieAsync(ObjectId id, MovieModel movie, IFormFile imageFile);
        Task<bool> DeleteMovieAsync(ObjectId id);
        Task<bool> AddMovieAsync(MovieModel movie);
    }
}
