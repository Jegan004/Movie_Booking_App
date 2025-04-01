namespace MovieBookingApp.Model
{
    public class AuthModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterModel : AuthModel
    {
        public string FullName { get; set; }
    }
}
