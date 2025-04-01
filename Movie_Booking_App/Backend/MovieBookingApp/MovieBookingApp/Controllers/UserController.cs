using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MovieBookingApp.Model;
using MovieBookingApp.Services;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;
using MovieBookingApp.Services.Interfaces;

namespace MovieBookingApp.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        private readonly IPlatformMetricsService _platformMetricsService;

        public UserController(IUserService userService, IJwtService jwtService, IPlatformMetricsService platformMetricsService)
        {
            _userService = userService;
            _jwtService = jwtService;
            _platformMetricsService = platformMetricsService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterModel registerModel)
        {
            try
            {
                if (registerModel == null)
                    return BadRequest("User data is null.");

                var existingUser = await _userService.GetUserByEmailAsync(registerModel.Email);
                if (existingUser != null)
                    return BadRequest("User already exists.");

                var user = new UserModel
                {
                    Email = registerModel.Email,
                    Password = registerModel.Password,
                    Name = registerModel.FullName,
                    Role = "User"
                };

                await _userService.CreateUserAsync(user);
                return Ok("User registered successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] AuthModel authModel)
        {
            try
            {
                if (authModel == null)
                    return BadRequest("Invalid credentials.");

                var user = await _userService.ValidateUserAsync(authModel);
                if (user == null)
                    return Unauthorized("Invalid credentials.");

                var token = _jwtService.GenerateJwtToken(user.Email, user.Id.ToString(), user.Role);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("total-users")]
        public async Task<IActionResult> GetTotalUsers()
        {
            var totalUsers = await _platformMetricsService.GetTotalUserCountAsync();
            return Ok(new { TotalUsers = totalUsers });
        }

        [HttpGet("top-users")]
        public async Task<IActionResult> GetTopUsersByBookings()
        {
            var topUsers = await _platformMetricsService.GetTopUsersByBookingsAsync();
            return Ok(topUsers);
        }

        [HttpGet("bookedmovies")]
        public async Task<IActionResult> GetMostBookedMovies()
        {
            var mostBookedMovies = await _platformMetricsService.GetMostBookedMoviesAsync();
            return Ok(mostBookedMovies);
        }

    }
}
