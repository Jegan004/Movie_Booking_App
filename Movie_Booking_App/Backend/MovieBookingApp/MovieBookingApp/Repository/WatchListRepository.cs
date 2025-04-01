using MongoDB.Driver;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace MovieBookingApp.Repository
{
    [ExcludeFromCodeCoverage]
    public class WatchListRepository : IWatchListRepository
    {
        private readonly IMongoCollection<WatchListModel> _watchListCollection;

        public WatchListRepository(IMongoDatabase database)
        {
            _watchListCollection = database.GetCollection<WatchListModel>("WatchLists");
        }

        public async Task<List<WatchListModel>> GetWatchListByUserIdAsync(string userId)
        {
            var filter = Builders<WatchListModel>.Filter.Eq(w => w.UserId, userId);
            return await _watchListCollection.Find(filter).ToListAsync();
        }

        public async Task<bool> AddToWatchListAsync(WatchListModel watchlistEntry)
        {
            try
            {
                await _watchListCollection.InsertOneAsync(watchlistEntry);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting into the database: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> RemoveFromUserWatchlistAsync(string userId, string movieId)
        {
            var filter = Builders<WatchListModel>.Filter.And(
                Builders<WatchListModel>.Filter.Eq(w => w.UserId, userId),
                Builders<WatchListModel>.Filter.Eq(w => w.MovieId, movieId)
            );

            var result = await _watchListCollection.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }

    }
}
