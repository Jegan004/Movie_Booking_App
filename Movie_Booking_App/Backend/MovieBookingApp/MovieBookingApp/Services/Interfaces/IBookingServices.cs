using MongoDB.Bson;
using MovieBookingApp.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Services
{
    public interface IBookingService
    {
        Task<BookingModel> CreateBookingAsync(BookingModel booking);
        Task<BookingModel> GetBookingByIdAsync(ObjectId id);
        Task<List<BookingModel>> GetBookingsByUserIdAsync(ObjectId userId);
       

    }
}
