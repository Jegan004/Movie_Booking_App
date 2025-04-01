using MongoDB.Driver;
using MongoDB.Bson;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;

namespace MovieBookingApp.Repository
{
    [ExcludeFromCodeCoverage]
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<UserModel> _userCollection;
        private readonly IMongoCollection<WatchListModel> _watchListCollection;

        public UserRepository(IMongoDatabase database)
        {
            _userCollection = database.GetCollection<UserModel>("Users");
            _watchListCollection = database.GetCollection<WatchListModel>("WatchLists");
        }

        public async Task<UserModel> CreateUserAsync(UserModel user)
        {
            await _userCollection.InsertOneAsync(user);
            return user;
        }

        public async Task<UserModel> GetUserByIdAsync(ObjectId id)
        {
            return await _userCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<UserModel> GetUserByEmailAsync(string email)
        {
            return await _userCollection.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<List<UserModel>> GetAllUsersAsync()
        {
            return await _userCollection.Find(_ => true).ToListAsync();
        }

        public async Task<bool> UpdateUserAsync(ObjectId id, UserModel user)
        {
            var updateDefinition = Builders<UserModel>.Update
                .Set(u => u.Email, user.Email)
                .Set(u => u.Password, user.Password)
                .Set(u => u.Role, user.Role)
                .Set(u => u.Name, user.Name)
                .Set(u => u.Bookings, user.Bookings)
                .Set(u => u.Watchlists, user.Watchlists);

            var result = await _userCollection.UpdateOneAsync(u => u.Id == id, updateDefinition);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteUserAsync(ObjectId id)
        {
            var result = await _userCollection.DeleteOneAsync(u => u.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        // Watchlist Methods
        public async Task<bool> AddToUserWatchlistAsync(ObjectId userId, WatchListModel watchListItem)
        {
            var filter = Builders<UserModel>.Filter.Eq(u => u.Id, userId);
            var update = Builders<UserModel>.Update.Push(u => u.Watchlists, watchListItem);
            var result = await _userCollection.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        public async Task<List<WatchListModel>> GetUserWatchlistAsync(ObjectId userId)
        {
            var user = await _userCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            return user?.Watchlists ?? new List<WatchListModel>();
        }

        public async Task<bool> RemoveFromUserWatchlistAsync(ObjectId userId, ObjectId movieId)
        {
            var filter = Builders<WatchListModel>.Filter.And(
                Builders<WatchListModel>.Filter.Eq(w => w.UserId, userId.ToString()),
                Builders<WatchListModel>.Filter.Eq(w => w.MovieId, movieId.ToString())
            );

            var result = await _watchListCollection.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }


    }
}
