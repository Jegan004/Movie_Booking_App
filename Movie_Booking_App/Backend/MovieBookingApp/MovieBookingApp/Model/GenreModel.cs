using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace MovieBookingApp.Model
{
    public class GenreModel
    {
        [BsonId]
        public ObjectId Id { get; set; }
        
        public string Name { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
    }
}
