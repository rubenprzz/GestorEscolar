using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using WebApplication1.Context;
using WebApplication1.Mappers;
using WebApplication1.Models;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });
    c.OperationFilter<FileUploadOperationFilter>();
});
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<DatabaseContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"], // Verifica esto
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true
        };
    });


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("DirectorPolicy", policy =>
        policy.RequireRole("Director"));
    options.AddPolicy("ProfesorPolicy", policy =>
        policy.RequireRole("Profesor"));
});
builder.Services.AddControllers();
builder.Services.AddScoped<AlumnoService>();
builder.Services.AddScoped<JustificanteService>();
builder.Services.AddScoped<AsignaturaService>();
builder.Services.AddScoped<AsistenciaService>();
builder.Services.AddScoped<RetrasoService>();
builder.Services.AddScoped<DatabaseContext>();
builder.Services.AddScoped<NotaService>();
builder.Services.AddScoped<PadreService>();
builder.Services.AddScoped<ProfesorService>();
builder.Services.AddScoped<CursoService>();
builder.Services.AddScoped<BaseMapper>();

builder.Services.AddScoped<FileService>();
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseNpgsql("DefaultConnection"));
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configura Identity


builder.Services.AddRazorPages();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
builder.Services.AddAutoMapper(typeof(Program));

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

    // Crear roles si no existen
    string[] roles = { "Director", "Profesor" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    var email = "director@admin.com";
    var dniU = "12345678A";
    var user = await userManager.FindByEmailAsync(email);

    if (user == null)
    {
        user = new User { UserName = email, Email = email ,dni = dniU };
        var result = await userManager.CreateAsync(user, "Admin123!");

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, "Director");
        }
        
    }
}


app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.WebRootPath, "uploads")),
    RequestPath = "/uploads"
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Use(async (context, next) =>
{
    var token = context.Request.Headers["Authorization"].ToString();
    if (!string.IsNullOrEmpty(token))
    {
        Console.WriteLine("Token recibido: " + token);
    }
    else
    {
        Console.WriteLine("No se ha recibido token.");
    }

    await next.Invoke();
});



app.Run();