using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using NetTopologySuite.Geometries;
using Pipos.GeoLib.Core.Api;
using Pipos.GeoLib.Core.Model;
using Pipos.GeoLib.Road;
using Pipos.GeoLib.Road.Model;
using WebEditor.Model;
using WebEditor.Model.DTO;

namespace WebEditor.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class RoadController : ControllerBase
{
    private readonly RoadService RoadService;
    private readonly SessionService SessionService;

    public RoadController(RoadService roadService, SessionService sessionService)
    {
        RoadService = roadService;
        SessionService = sessionService;
    }

    [HttpPost]
    [Authorize]
    public MesureResponse MesureTimeDistance([FromBody] MesureRequest request)
    {   
        string sessionId = Request.Cookies["session"]!;
        return RoadService.MesureTimeDistance(request, sessionId);
    }

    [HttpPost]
    [Authorize]
    public NewRoadResponse NewRoad([FromBody] SelectRoadRequest request)
    {
        string sessionId = Request.Cookies["session"]!;
        return RoadService.NewRoad(request, sessionId);
    }

    [HttpPost]
    [Authorize]
    public ModifyRoadResponse ModifyRoad([FromBody] SelectRoadRequest request)
    {
        string sessionId = Request.Cookies["session"]!;
        return RoadService.ModifyRoad(request, sessionId);
    }

    [HttpPost]
    [Authorize]
    public RemoveRoadResponse RemoveRoad([FromBody] SelectRoadRequest request)
    {
        string sessionId = Request.Cookies["session"]!;
        return RoadService.RemoveRoad(request, sessionId);
    }

    [HttpPost]
    [Authorize]
    public SelectEdgeResponse SelectEdge([FromBody] SelectEdgeRequest request)
    {          
        string sessionId = Request.Cookies["session"]!;
        return RoadService.SelectEdge(request, sessionId);
    }

    [HttpPost]
    [Authorize]
    public void UpdateCustomization([FromBody] RoadNetworkCustomization networkCustomization)
    {
        string sessionId = Request.Cookies["session"]!;
        SessionService.UpdateCustomization(networkCustomization, sessionId);
    }

    private void UnauthorizedRequest()
    {
        if (Request.Cookies["session"] != null) 
        { 
            var cookieOptions = new CookieOptions 
            { 
                Expires = DateTime.Now.AddDays(-1), 
                SameSite = SameSiteMode.Strict
            }; 
            Response.Cookies.Append("session", "", cookieOptions);
        }
        Response.StatusCode = StatusCodes.Status401Unauthorized;
    }
}
