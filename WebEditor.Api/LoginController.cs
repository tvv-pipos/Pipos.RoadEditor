using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using NetTopologySuite.Geometries;
using Pipos.GeoLib.Core.Api;
using Pipos.GeoLib.Core.Model;
using Pipos.GeoLib.Road;
using Pipos.GeoLib.Road.IO;
using WebEditor.Model;
using Microsoft.Extensions.Caching.Memory;

namespace WebEditor.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class LoginController : ControllerBase
{
    public class Credentials 
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
    private readonly List<(string, string)> Users = new List<(string, string)> {
        ( "trafikverket", "Sommar2019!" ),
        ( "tillvaxtverket", "Sommar2022!" )
    };

    private readonly SessionService SessionService;
    public LoginController(SessionService sessionService)
    {
        SessionService = sessionService;
    }

    [HttpPost]
    public LoginResponse Login([FromBody] Credentials credentials)
    {
        foreach(var user in Users)
        {
            if(user.Item1 == credentials.Username)
            {
                if(user.Item2 == credentials.Password)
                {
                    string sessionId = SessionService.NewSession();
                    Response.Cookies.Append("session", sessionId, new CookieOptions{ Expires = DateTime.Now.AddDays(1), SameSite = SameSiteMode.Strict});
                    return new LoginResponse { HasSession = true, Id = sessionId };
                }
            }
        }
        return new LoginResponse { HasSession = false, Id = null };
    }

    [HttpGet]
    public LoginResponse Refresh()
    {
        string? sessionId = Request.Cookies["session"];
        if (sessionId != null) 
        {
            bool hasSession = SessionService.HasSession(sessionId);
            if(hasSession) 
            {
                Response.Cookies.Append("session", sessionId, new CookieOptions{ Expires = DateTime.Now.AddDays(1), SameSite = SameSiteMode.Strict});
                return new LoginResponse { HasSession = true, Id = sessionId };
            }
            var cookieOptions = new CookieOptions 
            { 
                Expires = DateTime.Now.AddDays(-1), 
                SameSite = SameSiteMode.Strict, 
            }; 
            Response.Cookies.Append("session", "", cookieOptions);
        }
        return new LoginResponse { HasSession = false, Id = null };        
    }

}
