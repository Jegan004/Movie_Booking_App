using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MovieBookingApp.Model
{
    public class UserModel
    {
        [BsonId]
        public ObjectId Id { get; set; }
        [BsonRequired]
        public string Email { get; set; }
        [BsonRequired]
        public string Password { get; set; } 
        public string Role { get; set; } 
        public string Name { get; set; } 
        public List<BookingModel> Bookings { get; set; } = new List<BookingModel>();
        public List<WatchListModel> Watchlists { get; set; } = new List<WatchListModel>();
    }
}
