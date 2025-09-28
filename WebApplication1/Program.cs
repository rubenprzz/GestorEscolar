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


builder.Services.AddDbContext<DatabaseContext>(options =>
{
    var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? 
                          builder.Configuration.GetConnectionString("DefaultConnection");
    
    // DEBUG: Agregar logs
    Console.WriteLine($"DATABASE_URL env var: {Environment.GetEnvironmentVariable("DATABASE_URL")}");
    Console.WriteLine($"DefaultConnection config: {builder.Configuration.GetConnectionString("DefaultConnection")}");
    Console.WriteLine($"Final connection string: {connectionString}");
    
    if (connectionString?.StartsWith("postgres://") == true)
    {
        connectionString = connectionString.Replace("postgres://", "postgresql://");
        Console.WriteLine($"Converted connection string: {connectionString}");
    }
    
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("No connection string found!");
    }
    
    options.UseNpgsql(connectionString);
});


// Identity y JWT
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<DatabaseContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? builder.Configuration["JWT:Issuer"],
            ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY") ?? builder.Configuration["JWT:Key"]!)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true
        };
    });

// Autorización
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("DirectorPolicy", policy => policy.RequireRole("Director"));
    options.AddPolicy("ProfesorPolicy", policy => policy.RequireRole("Profesor"));
});

// Servicios
builder.Services.AddScoped<AlumnoService>();
builder.Services.AddScoped<JustificanteService>();
builder.Services.AddScoped<AsignaturaService>();
builder.Services.AddScoped<AsistenciaService>();
builder.Services.AddScoped<RetrasoService>();
builder.Services.AddScoped<NotaService>();
builder.Services.AddScoped<PadreService>();
builder.Services.AddScoped<ProfesorService>();
builder.Services.AddScoped<CursoService>();
builder.Services.AddScoped<BaseMapper>();
builder.Services.AddScoped<FileService>();

builder.Services.AddControllers();
builder.Services.AddRazorPages();
builder.Services.AddAutoMapper(typeof(Program));

// CORS ajustado para producción
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
// Y cambiar el UseCors:
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });
    c.OperationFilter<FileUploadOperationFilter>();
});

var app = builder.Build();

// Migraciones automáticas para Render
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
        await context.Database.MigrateAsync();
        
        // Crear roles y usuario inicial
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

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
            user = new User { UserName = email, Email = email, dni = dniU };
            var result = await userManager.CreateAsync(user, "Admin123!");
            if (result.Succeeded)
                await userManager.AddToRoleAsync(user, "Director");
        }
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error durante la inicialización de la base de datos");
    }
}

// Servir Angular
app.UseDefaultFiles();
app.UseStaticFiles();

// Carpeta de uploads - Ajustar para Render
var uploadsPath = Path.Combine(app.Environment.WebRootPath, "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

// Swagger solo en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configuración para Render
app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();       // Mover aquí
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();