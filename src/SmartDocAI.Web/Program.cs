using Microsoft.AspNetCore.Http.Features;
using SmartDocAI.Infrastructure.Configuration;
using SmartDocAI.Web.Middleware;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);


// Bind JwtSettings first and validate presence of secret
var jwtSection = builder.Configuration.GetSection("JwtSettings");
var jwtSettings = jwtSection.Get<JwtSettings>();

// Optionally: log presence (but never log the secret value).
var loggerFactory = LoggerFactory.Create(lb => lb.AddConsole());
var startupLogger = loggerFactory.CreateLogger("StartupCheck");
startupLogger.LogInformation("JwtSettings present: {HasSection}", jwtSection.Exists());

// Validate secret presence (fail fast with a clear message)
if (string.IsNullOrWhiteSpace(jwtSettings?.Secret))
{
    // In development you may want a clearer instruction; in production we must fail.
    var message = "JwtSettings:Secret is not configured. Set JwtSettings__Secret in environment/appsettings or user-secrets.";
    startupLogger.LogCritical(message);
    throw new InvalidOperationException(message);
}

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();
builder.Services.AddControllers();

//To have casing consitency across both the frontend and backend this code can be used
//builder.Services.AddControllers().AddJsonOptions(opts=>opts.JsonSerializerOptions.PropertyNamingPolicy=System.Text.Json.JsonNamingPolicy.CamelCase);

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
    //options.AddPolicy("AllowReactApp",
    //    builder => builder.WithOrigins(
    //        "https://ambitious-stone-05cbaea0f.2.azurestaticapps.net",
    //        "http://localhost:3000")
    //                      .AllowAnyMethod()
    //                      .AllowAnyHeader());
    options.AddPolicy("AllowReactApp", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.Configure<FormOptions>(options =>
{
    // Set the maximum file size to 100 MB
    options.MultipartBodyLengthLimit = 100 * 1024 * 1024; // 100 MB
});

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
    var key = Encoding.ASCII.GetBytes(jwtSettings!.Secret);
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Configuration.AddEnvironmentVariables();

//Docker, Visual Studio Kestrel specific code
//builder.WebHost.ConfigureKestrel(serverOptions =>
//{
//    // 80 or 5000, depending on your need    
//    serverOptions.ListenAnyIP(80); // Make app listen on port 80 inside the container
//});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
    app.UseSwagger();
    //app.UseSwaggerUI(c =>
    //{
    //    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartDocAI API V1");
    //    c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    //});
    app.UseSwaggerUI();
    //app.UseHttpsRedirection();
}

//var disableHttps = builder.Configuration.GetValue<bool>("DisableHttps");

//if (!disableHttps)
//{
//    app.UseHttpsRedirection();
//}

app.UseCors("AllowReactApp");
app.UseRouting();



app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();


app.UseMiddleware<ExceptionMiddleware>();
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
