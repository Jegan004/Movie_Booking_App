using MongoDB.Driver;
using MovieBookingApp.Model;
using MongoDB.Bson;
using System.Diagnostics.CodeAnalysis;

namespace MovieBookingApp.Repository
{
    [ExcludeFromCodeCoverage]
    public class MovieRepository : IMovieRepository
    {
        private readonly IMongoCollection<MovieModel> _movieCollection;

        public MovieRepository(IMongoDatabase database)
        {
            _movieCollection = database.GetCollection<MovieModel>("Movies");
        }

        public async Task<MovieModel> CreateMovieAsync(MovieModel movie)
        {
            await _movieCollection.InsertOneAsync(movie);
            return movie;
        }

        public async Task<MovieModel> GetMovieByIdAsync(ObjectId id)
        {
            return await _movieCollection.Find(m => m.Id == id).FirstOrDefaultAsync();
        }



        public async Task<List<MovieModel>> GetAllMoviesAsync()
        {
            return await _movieCollection.Find(_ => true).ToListAsync();
        }
        public async Task<MovieModel> FindMovieByTitleAsync(string title)
        {
            var filter = Builders<MovieModel>.Filter.Regex(m => m.Title, new BsonRegularExpression(title, "i"));

            return await _movieCollection.Find(filter).FirstOrDefaultAsync();  
        }
        public async Task<bool> UpdateMovieAsync(ObjectId id, MovieModel movie)
        {
            var updateDefinition = Builders<MovieModel>.Update
                .Set(m => m.Title, movie.Title)
                .Set(m => m.Description, movie.Description)
                .Set(m => m.ReleaseDate, movie.ReleaseDate)
                .Set(m => m.Status, movie.Status)
                .Set(m => m.Genres, movie.Genres)
                .Set(m => m.ImageUrl, movie.ImageUrl);

            var result = await _movieCollection.UpdateOneAsync(m => m.Id == id, updateDefinition);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteMovieAsync(ObjectId id)
        {
            var result = await _movieCollection.DeleteOneAsync(m => m.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        //public async Task SaveMoviePoster(string movieId, string imageFileName)
        //{
        //    var updateDefinition = Builders<MovieModel>.Update.Set(m => m.ImageUrl, imageFileName);
        //    var result = await _movieCollection.UpdateOneAsync(m => m.Id == ObjectId.Parse(movieId), updateDefinition);
        //}

        public async Task<List<MovieModel>> GetMoviesByGenreAsync(string genre)
        {
            return await _movieCollection.Find(m => m.Genres.Any(g => g.Name == genre)).ToListAsync();
        }
    }
}
