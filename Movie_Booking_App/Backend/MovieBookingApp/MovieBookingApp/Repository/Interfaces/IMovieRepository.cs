using MongoDB.Bson;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Repository
{
    public interface IMovieRepository
    {
        Task<MovieModel> CreateMovieAsync(MovieModel movie);
        Task<MovieModel> GetMovieByIdAsync(ObjectId id);
        Task<List<MovieModel>> GetAllMoviesAsync();
        Task<MovieModel> FindMovieByTitleAsync(string title);
        Task<List<MovieModel>> GetMoviesByGenreAsync(string genre);
        Task<bool> UpdateMovieAsync(ObjectId id, MovieModel movie);
        Task<bool> DeleteMovieAsync(ObjectId id);
        //Task SaveMoviePoster(string movieId, string imageFileName);
    }
}
