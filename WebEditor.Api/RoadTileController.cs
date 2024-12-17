using System;
using SkiaSharp;
using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite;
using Pipos.GeoLib.Core.Model;
using Microsoft.AspNetCore.Authorization;

namespace WebEditor.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoadTileController : ControllerBase
{
    private readonly string ConnectionString = "Data Source=tilecache.db";
    private readonly RoadService RoadService;
    private readonly SessionService SessionService;

    public RoadTileController(RoadService roadService, SessionService sessionService)
    {
        RoadService = roadService;
        SessionService = sessionService;
        CreateDatabaseAndTableIfNotExists();
    }

    [HttpGet("{z}/{x}/{y}/{year}.png")]
    public IActionResult GetTile(int z, int x, int y, int year)
    {
        string sessionId = Request.Cookies["session"]!;
        if (SessionService.HasSession(sessionId))
        {
            string key = $"{year}_{z}_{x}_{y}";
            byte[] img = GetTileFromCache(key);
            if (img.Length > 0)
            {
                return File(img, "image/png");
            }
            else
            {
                var image = RoadService.GetTile(x, y, z, new Year(year), sessionId);
                img = image.Encode(SKEncodedImageFormat.Png, 100).ToArray();
                SaveTileToCache(key, img);
                return File(img, "image/png");
            }
        }
        return Unauthorized();
    }

    private byte[] GetTileFromCache(string tileId)
    {
        try
        {
            using (var connection = new SQLiteConnection(ConnectionString))
            {
                connection.Open();
                using (var command = new SQLiteCommand("SELECT tile FROM TileCache WHERE tileId = @tileId", connection))
                {
                    command.Parameters.AddWithValue("@tileId", tileId);
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return (byte[])reader["tile"];
                        }
                    }
                }
            }
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
        return new byte[0];
    }

    private void SaveTileToCache(string tileId, byte[] tile)
    {
        try
        {
            using (var connection = new SQLiteConnection(ConnectionString))
            {
                connection.Open();
                using (var command = new SQLiteCommand("INSERT INTO TileCache (tileId, tile) VALUES (@tileId, @tile)", connection))
                {
                    command.Parameters.AddWithValue("@tileId", tileId);
                    command.Parameters.AddWithValue("@tile", tile);
                    command.ExecuteNonQuery();
                }
            }
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    private void CreateDatabaseAndTableIfNotExists()
    {
        try
        {
            using (var connection = new SQLiteConnection(ConnectionString))
            {
                connection.Open();
                using (var command = new SQLiteCommand(@"
                CREATE TABLE IF NOT EXISTS TileCache (
                    tileId TEXT PRIMARY KEY,
                    tile BLOB
                );
                CREATE INDEX IF NOT EXISTS idx_tileId ON TileCache(tileId);
            ", connection))
                {
                    command.ExecuteNonQuery();
                }
            }
        } 
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}
