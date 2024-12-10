using NetTopologySuite.IO.Converters;
using System.Text.Json;
using Pipos.GeoLib.Core.Model;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new GeoJsonConverterFactory());
        options.JsonSerializerOptions.Converters.Add(new Coordinate2DConverter());
    });
builder.Services.AddAuthentication("Basic")
    .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("Basic", null);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<RoadService>();
builder.Services.AddSingleton<SessionService>();
builder.Services.AddSingleton<NetworkService>();
builder.Services.AddHostedService<RoadLoader>();

var app = builder.Build();


app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.UseExceptionHandler("/Home/Error");
app.UseHsts();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapFallbackToFile("/index.html");
app.MapControllers();

app.Run();
