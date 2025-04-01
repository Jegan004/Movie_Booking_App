using MongoDB.Driver;
using MovieBookingApp.Services;
using MovieBookingApp.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.FileProviders;
using System.Text.Json.Serialization;
using MovieBookingApp.Services.Interfaces;
using MovieBookingApp.Repository.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// MongoDB Configuration
var mongoConnectionString = builder.Configuration.GetValue<string>("MongoDB:ConnectionString");
var mongoDatabaseName = builder.Configuration.GetValue<string>("MongoDB:DatabaseName");
var client = new MongoClient(mongoConnectionString);
var database = client.GetDatabase(mongoDatabaseName);

// Register MongoDB-related services
builder.Services.AddSingleton<IMongoDatabase>(database);

// Register JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
        };
    });


builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMovieRepository, MovieRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IWatchListRepository, WatchListRepository>();
builder.Services.AddScoped<IFavoriteRepository, FavoriteRepository>();
builder.Services.AddScoped<IPlatformMetricsRepository, PlatformMetricsRepository>();

// Register Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IWatchListService, WatchListService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<IPlatformMetricsService, PlatformMetricsService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });


builder.Services.AddAuthorization(options =>
{
    // options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) 
                .AllowCredentials());

//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider(@"C:\movies"),
//    RequestPath = "/posters",
//    OnPrepareResponse = ctx =>
//    {
//        Console.WriteLine($"Serving file: {ctx.File.PhysicalPath}");
//    }
//});

//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider(@"C:\movies"),
//    RequestPath = "/posters"
//});

app.MapControllers();
app.Run();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
