using MongoDB.Bson;
using MongoDB.Driver;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Services
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<UserModel> _userCollection;

        public UserService(IMongoDatabase database)
        {
            _userCollection = database.GetCollection<UserModel>("Users");
        }

        public async Task<UserModel> CreateUserAsync(UserModel user)
        {
            var existingUser = await GetUserByEmailAsync(user.Email);
            if (existingUser != null)
                throw new InvalidOperationException("User with this email already exists.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            await _userCollection.InsertOneAsync(user);
            return user;
        }

        public async Task<UserModel> GetUserByEmailAsync(string email)
        {
            return await _userCollection.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<UserModel> GetUserByIdAsync(ObjectId id)
        {
            return await _userCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<UserModel> ValidateUserAsync(AuthModel authModel)
        {
            var user = await GetUserByEmailAsync(authModel.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(authModel.Password, user.Password))
                return null;

            return user;
        }

        public async Task<bool> UpdateUserAsync(ObjectId id, UserModel user)
        {
            var updateDefinition = Builders<UserModel>.Update
                .Set(u => u.Name, user.Name)
                .Set(u => u.Role, user.Role)
                .Set(u => u.Email, user.Email)
                .Set(u => u.Watchlists, user.Watchlists)
                .Set(u => u.Bookings, user.Bookings);

            var result = await _userCollection.UpdateOneAsync(u => u.Id == id, updateDefinition);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteUserAsync(ObjectId id)
        {
            var deleteResult = await _userCollection.DeleteOneAsync(u => u.Id == id);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
        }
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

        

    }
}
