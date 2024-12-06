using Microsoft.AspNetCore.Identity;

namespace WebApplication1.Models;

public class User : IdentityUser
{
    public bool isDeleted { get; set; }
    public string? Dni { get; set; }
}