using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using Moq;
using MovieBookingApp.Controllers;
using MovieBookingApp.Model;
using MovieBookingApp.Services;
using MovieBookingApp.Services.Interfaces;
using NUnit.Framework;
using System;
using System.Threading.Tasks;
namespace MovieBookingApp.Tests.ControllerTests
{
    [TestFixture]
    public class UserControllerTests
    {
        private Mock<IUserService> _userServiceMock;
        private Mock<IJwtService> _jwtServiceMock;
        private Mock<IPlatformMetricsService> _platformMetricsServiceMock;
        private UserController _controller;

        [SetUp]
        public void Setup()
        {
            _userServiceMock = new Mock<IUserService>();
            _jwtServiceMock = new Mock<IJwtService>();
            _platformMetricsServiceMock=new Mock<IPlatformMetricsService>();
            _controller = new UserController(_userServiceMock.Object, _jwtServiceMock.Object,_platformMetricsServiceMock.Object);
        }

        [Test]
        public async Task RegisterUser_ReturnsOk_WhenUserIsRegisteredSuccessfully()
        {
            var registerModel = new RegisterModel
            {
                Email = "test@example.com",
                Password = "password",
                FullName = "Test User"
            };

            _userServiceMock.Setup(service => service.GetUserByEmailAsync(registerModel.Email)).ReturnsAsync((UserModel)null);
            //_userServiceMock.Setup(service => service.CreateUserAsync(It.IsAny<UserModel>())).Returns(Task.CompletedTask);

            var result = await _controller.RegisterUser(registerModel) as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual("User registered successfully.", result.Value);
        }

        [Test]
        public async Task RegisterUser_ReturnsBadRequest_WhenUserAlreadyExists()
        {
            var registerModel = new RegisterModel
            {
                Email = "test@example.com",
                Password = "password",
                FullName = "Test User"
            };

            var existingUser = new UserModel
            {
                Email = registerModel.Email,
                Password = "password",
                Name = "Test User",
                Role = "User"
            };

            _userServiceMock.Setup(service => service.GetUserByEmailAsync(registerModel.Email)).ReturnsAsync(existingUser);

            var result = await _controller.RegisterUser(registerModel) as BadRequestObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("User already exists.", result.Value);
        }

        [Test]
        public async Task RegisterUser_ReturnsBadRequest_WhenUserDataIsNull()
        {
            var result = await _controller.RegisterUser(null) as BadRequestObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("User data is null.", result.Value);
        }

        [Test]
        public async Task LoginUser_ReturnsUnauthorized_WhenCredentialsAreInvalid()
        {
            var authModel = new AuthModel
            {
                Email = "test@example.com",
                Password = "wrongpassword"
            };

            _userServiceMock.Setup(service => service.ValidateUserAsync(authModel)).ReturnsAsync((UserModel)null);

            var result = await _controller.LoginUser(authModel) as UnauthorizedObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(401, result.StatusCode);
            Assert.AreEqual("Invalid credentials.", result.Value);
        }

        [Test]
        public async Task LoginUser_ReturnsBadRequest_WhenCredentialsAreNull()
        {
            var result = await _controller.LoginUser(null) as BadRequestObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Invalid credentials.", result.Value);
        }

        [Test]
        public async Task RegisterUser_ReturnsInternalServerError_WhenExceptionOccurs()
        {
            var registerModel = new RegisterModel
            {
                Email = "test@example.com",
                Password = "password",
                FullName = "Test User"
            };

            _userServiceMock.Setup(service => service.GetUserByEmailAsync(registerModel.Email)).ThrowsAsync(new Exception("Some error"));

            var result = await _controller.RegisterUser(registerModel) as ObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(500, result.StatusCode);
            Assert.AreEqual("Internal server error: Some error", result.Value);
        }

        [Test]
        public async Task LoginUser_ReturnsInternalServerError_WhenExceptionOccurs()
        {
            var authModel = new AuthModel
            {
                Email = "test@example.com",
                Password = "password"
            };

            _userServiceMock.Setup(service => service.ValidateUserAsync(authModel)).ThrowsAsync(new Exception("Some error"));

            var result = await _controller.LoginUser(authModel) as ObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(500, result.StatusCode);
            Assert.AreEqual("Internal server error: Some error", result.Value);
        }
    }
}
