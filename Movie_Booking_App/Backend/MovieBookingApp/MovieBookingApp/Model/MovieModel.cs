using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MovieBookingApp.Model
{
    public class MovieModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]  
        public ObjectId Id { get; set; }
        [BsonRequired]
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Status { get; set; }
        public List<GenreModel> Genres { get; set; }
        public string ImageUrl { get; set; }  
    }
}
