using MongoDB.Bson;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Repository
{
    public interface IUserRepository
    {
        Task<UserModel> CreateUserAsync(UserModel user);
        Task<UserModel> GetUserByIdAsync(ObjectId id);
        Task<UserModel> GetUserByEmailAsync(string email);
        Task<List<UserModel>> GetAllUsersAsync();
        Task<bool> UpdateUserAsync(ObjectId id, UserModel user);
        Task<bool> DeleteUserAsync(ObjectId id);

        Task<bool> AddToUserWatchlistAsync(ObjectId userId, WatchListModel watchListItem);
        Task<List<WatchListModel>> GetUserWatchlistAsync(ObjectId userId);
        Task<bool> RemoveFromUserWatchlistAsync(ObjectId userId, ObjectId movieId);
    }
}
