using Microsoft.AspNetCore.Mvc;

namespace MovieBookingApp.Services.Interfaces
{
    public interface IPlatformMetricsService
    {
        Task<int> GetTotalUserCountAsync();
        Task<List<object>> GetTopUsersByBookingsAsync();
        Task<List<object>> GetMostBookedMoviesAsync();
    }
}
