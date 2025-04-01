using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace MovieBookingApp.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateJwtToken(string email, string userId, string role);
        ClaimsPrincipal ValidateToken(string token);
    }
}
