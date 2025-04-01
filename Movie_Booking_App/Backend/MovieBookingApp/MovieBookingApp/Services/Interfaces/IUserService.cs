using MongoDB.Bson;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Services
{
    public interface IUserService
    {
        Task<UserModel> GetUserByEmailAsync(string email);
        Task<UserModel> CreateUserAsync(UserModel user);
        Task<UserModel> GetUserByIdAsync(ObjectId id);
        Task<bool> UpdateUserAsync(ObjectId id, UserModel user);
        Task<bool> DeleteUserAsync(ObjectId id);
        Task<UserModel> ValidateUserAsync(AuthModel authModel);

        Task<bool> AddToUserWatchlistAsync(ObjectId userId, WatchListModel watchListItem);
        Task<List<WatchListModel>> GetUserWatchlistAsync(ObjectId userId);
        
    }
}
