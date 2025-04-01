using Microsoft.AspNetCore.Mvc;

namespace MovieBookingApp.Repository.Interfaces
{
    public interface IPlatformMetricsRepository
    {
        
        Task<int> GetTotalUserCountAsync();
        Task<List<(string UserId, int BookingCount)>> GetTopUsersByBookingsAsync();
        Task<List<(string MovieId, int BookingCount)>> GetMostBookedMoviesAsync();
    }
}