using MongoDB.Bson;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Services
{
    public interface IWatchListService
    {
        Task<List<WatchListModel>> GetWatchListByUserIdAsync(string userId);
        Task<bool> AddToUserWatchlistAsync(string userId, string  movieId);
        Task<bool> RemoveFromWatchListAsync(string userId, string movieId);
    }
}
