using Flashcards_spa.Authorization;
using Flashcards_spa.Data;
using Flashcards_spa.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                       throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
        {
            // Password settings
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = true;
            options.Password.RequireLowercase = true;
            options.Password.RequiredUniqueChars = 6;

            // User settings
            options.User.RequireUniqueEmail = true;

            // Signin settings
            options.SignIn.RequireConfirmedAccount = false;
        }
    )
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

builder.Services.AddAuthentication()
    .AddIdentityServerJwt();

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// Register DAL services for dependency injection
builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();
builder.Services.AddScoped<IDeckRepository, DeckRepository>();
builder.Services.AddScoped<ICardRepository, CardRepository>();
// builder.Services.AddScoped<ISessionRepository, SessionRepository>();

// Register authorization handlers
builder.Services.AddScoped<IAuthorizationHandler, SubjectAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, DeckAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, CardAuthorizationHandler>();
// builder.Services.AddScoped<IAuthorizationHandler, SessionAuthorizationHandler>();

var loggerConfig = new LoggerConfiguration()
    .MinimumLevel.Information() // Sets information as minimum log level. 
    .WriteTo.File($"Logs/Flashcards_{DateTime.Now:yyyy-MM-dd_HHmmss}.log");

loggerConfig.Filter.ByExcluding(e => e.Properties.TryGetValue("SourceContext", out _) &&
                                     e.Level == LogEventLevel.Information &&
                                     e.MessageTemplate.Text.Contains("Executed DbCommand"));
var logger = loggerConfig.CreateLogger();
builder.Logging.AddSerilog(logger);

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling =
        ReferenceLoopHandling.Serialize;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Flashcards API", Version = "v1" });
        // The following code block is taken from: https://medium.com/@deidra108/oauth-bearer-token-with-swagger-ui-net-6-0-86835e616deb
        // Start code
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "bearer"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
        });
        // End code
    }
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();

    // Seed the database
    using var serviceScope = app.Services.CreateScope();
    var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    DbInit.Seed(context);

    // Enable swagger
    app.UseSwagger();
    app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Flashcards API V1"); });
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseIdentityServer();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

// app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();