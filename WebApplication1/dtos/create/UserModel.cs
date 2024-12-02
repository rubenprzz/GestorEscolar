namespace WebApplication1.dtos.create;


public class RegisterModel
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string? ConfirmPassword { get; set; }
    public string? Role { get; set; } // Admin o Usuario
}
public class LoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}
