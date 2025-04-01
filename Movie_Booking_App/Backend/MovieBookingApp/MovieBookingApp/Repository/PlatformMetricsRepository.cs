using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MovieBookingApp.Model;
using MovieBookingApp.Repository.Interfaces;

namespace MovieBookingApp.Repository
{
    public class PlatformMetricsRepository : IPlatformMetricsRepository
    {
        private readonly IMongoCollection<UserModel> _users;
        private readonly IMongoCollection<BookingModel> _bookings;
        private readonly IMongoCollection<MovieModel> _movies;

        public PlatformMetricsRepository(IMongoDatabase database)
        {
            _users = database.GetCollection<UserModel>("Users");
            _bookings = database.GetCollection<BookingModel>("Bookings");
            _movies = database.GetCollection<MovieModel>("Movies");
        }

        public async Task<int> GetTotalUserCountAsync()
        {
            return (int)await _users.CountDocumentsAsync(user => user.Role == "User");
        }

        public async Task<List<(string UserId, int BookingCount)>> GetTopUsersByBookingsAsync()
        {
            var bookings = await _bookings.Find(_ => true).ToListAsync();
            return bookings
                .GroupBy(b => b.UserId)
                .Select(group => (group.Key, group.Count()))
                .OrderByDescending(x => x.Item2)
                .Take(10)
                .ToList();
        }
    
        public async Task<List<(string MovieId, int BookingCount)>> GetMostBookedMoviesAsync()
        {
            var bookings = await _bookings.Find(_ => true).ToListAsync();
            return bookings
                .GroupBy(b => b.MovieId)
                .Select(group => (group.Key, group.Count()))
                .OrderByDescending(x => x.Item2)
                .Take(10)
                .ToList();
        }
    }
}
