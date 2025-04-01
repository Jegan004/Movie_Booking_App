using MongoDB.Driver;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace MovieBookingApp.Repository
{
    [ExcludeFromCodeCoverage]
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly IMongoCollection<FavoriteModel> _favoriteCollection;

        public FavoriteRepository(IMongoDatabase database)
        {
            _favoriteCollection = database.GetCollection<FavoriteModel>("Favourites");
        }

        public async Task<List<FavoriteModel>> GetFavoritesByUserIdAsync(string userId)
        {
            var filter = Builders<FavoriteModel>.Filter.Eq(f => f.UserId, userId);
            return await _favoriteCollection.Find(filter).ToListAsync();
        }

        public async Task<bool> AddToFavoritesAsync(FavoriteModel favoriteEntry)
        {
            try
            {
                await _favoriteCollection.InsertOneAsync(favoriteEntry);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting into the database: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> RemoveFromUserFavoritesAsync(string userId, string movieId)
        {
            var filter = Builders<FavoriteModel>.Filter.And(
                Builders<FavoriteModel>.Filter.Eq(f => f.UserId, userId),
                Builders<FavoriteModel>.Filter.Eq(f => f.MovieId, movieId)
            );

            var result = await _favoriteCollection.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }
    }
}
