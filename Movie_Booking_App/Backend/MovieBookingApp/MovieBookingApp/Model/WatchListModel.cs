using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace MovieBookingApp.Model
{
    public class WatchListModel
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]

        public string MovieId { get; set; }
        public string MovieTitle { get; set; }
        public List<GenreModel> Genres { get; set; }
        public string MovieImage { get; set; }
    }
}
