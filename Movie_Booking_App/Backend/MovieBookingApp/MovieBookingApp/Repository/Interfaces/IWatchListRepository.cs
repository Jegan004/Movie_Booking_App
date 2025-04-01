using MongoDB.Bson;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Repository
{
    public interface IWatchListRepository
    {
        Task<List<WatchListModel>> GetWatchListByUserIdAsync(string userId);
        Task<bool> AddToWatchListAsync(WatchListModel watchlistEntry);
        Task<bool> RemoveFromUserWatchlistAsync(string userId, string movieId);
    }
}
