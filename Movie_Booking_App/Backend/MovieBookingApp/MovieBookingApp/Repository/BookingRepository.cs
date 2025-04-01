using MongoDB.Driver;
using MongoDB.Bson;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;

namespace MovieBookingApp.Repository
{
    [ExcludeFromCodeCoverage]
    public class BookingRepository : IBookingRepository
    {
        private readonly IMongoCollection<BookingModel> _bookings;

        public BookingRepository(IMongoDatabase database)
        {
            _bookings = database.GetCollection<BookingModel>("Bookings");
        }

        public async Task<BookingModel> CreateBookingAsync(BookingModel booking)
        {
            await _bookings.InsertOneAsync(booking);
            return booking;
        }

        public async Task<BookingModel> GetBookingByIdAsync(ObjectId id)
        {
            return await _bookings.Find(b => b.Id == id.ToString()).FirstOrDefaultAsync();
        }

        public async Task<List<BookingModel>> GetBookingsByUserIdAsync(ObjectId userId)
        {
            return await _bookings.Find(b => b.UserId == userId.ToString()).ToListAsync();
        }
    }
}
