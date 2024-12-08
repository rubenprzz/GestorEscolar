using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebApplication1.dtos.create;
using WebApplication1.Models;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AccountController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new User
        {
            UserName = model.Email,
            Email = model.Email,
            dni = model.dni
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        if (!await _roleManager.RoleExistsAsync("Profesor"))
        {
            await _roleManager.CreateAsync(new IdentityRole("Profesor"));
        }

        await _userManager.AddToRoleAsync(user, "Profesor");

        return Ok(new { Message = "Usuario registrado exitosamente con el rol Profesor" });
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),    
                new Claim(JwtRegisteredClaimNames.Aud, "RubenFernandezLuisVives") ,
                new Claim(JwtRegisteredClaimNames.Iss, "RubenFernandezLuisVives"),


                
            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes("estaesmiclavesecretaparafirmareljwtynodeberiasaberlanadieapartedemi")), SecurityAlgorithms.HmacSha512Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(securityToken);

            return Ok(new { Token = token });
        }

        return Unauthorized();
    }
    [HttpPost("logout")]
    public IActionResult Logout()
    {
     
        return Ok(new { Message = "Usuario desconectado exitosamente" });
    }

}