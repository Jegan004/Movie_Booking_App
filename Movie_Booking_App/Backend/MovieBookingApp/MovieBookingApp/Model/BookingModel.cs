using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace MovieBookingApp.Model
{
    public class BookingModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string MovieId { get; set; }
        [BsonRequired]
        public DateTime Showtime { get; set; }
        [BsonRequired]
        public double TicketPrice { get; set; }
        [BsonRequired]
        public int TicketCount { get; set; }
        [BsonRequired]
        public double TotalPrice { get; set; }

     
    }
}
