using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Repository
{
    public interface IFavoriteRepository
    {
        Task<List<FavoriteModel>> GetFavoritesByUserIdAsync(string userId);
        Task<bool> AddToFavoritesAsync(FavoriteModel favoriteEntry);
        Task<bool> RemoveFromUserFavoritesAsync(string userId, string movieId);
    }
}
