using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Services
{
    public interface IFavoriteService
    {
        Task<List<FavoriteModel>> GetFavoritesByUserIdAsync(string userId);
        Task<bool> AddToUserFavoritesAsync(string userId, string movieId);
        Task<bool> RemoveFromFavoritesAsync(string userId, string movieId);
    }
}
