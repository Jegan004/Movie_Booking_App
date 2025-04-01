using Moq;
using MongoDB.Bson;
using MongoDB.Driver;
using NUnit.Framework;
using MovieBookingApp.Model;
using MovieBookingApp.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieBookingApp.Tests.Services
{
    [TestFixture]
    public class UserServiceTests
    {
        private Mock<IMongoCollection<UserModel>> _userCollectionMock;
        private Mock<IFindFluent<UserModel, UserModel>> _findFluentMock;
        private UserService _userService;

        [SetUp]
        public void SetUp()
        {
            _userCollectionMock = new Mock<IMongoCollection<UserModel>>();
            _findFluentMock = new Mock<IFindFluent<UserModel, UserModel>>();
        }

      

    
    }
}
