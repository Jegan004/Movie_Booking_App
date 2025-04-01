using MongoDB.Bson;
using MovieBookingApp.Model;
using MovieBookingApp.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;

        public BookingService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<BookingModel> CreateBookingAsync(BookingModel booking)
        {
            return await _bookingRepository.CreateBookingAsync(booking);
        }

        public async Task<BookingModel> GetBookingByIdAsync(ObjectId id)
        {
            return await _bookingRepository.GetBookingByIdAsync(id);
        }

        public async Task<List<BookingModel>> GetBookingsByUserIdAsync(ObjectId userId)
        {
            return await _bookingRepository.GetBookingsByUserIdAsync(userId);
        }

       

    }
}
