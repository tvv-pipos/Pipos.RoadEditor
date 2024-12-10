using System;
using System.Linq;
using NetTopologySuite.Geometries;
using SkiaSharp;
using Pipos.GeoLib.Core.Api;
using Pipos.GeoLib.Core.Model;
using Pipos.GeoLib.Road;
using Pipos.GeoLib.Road.Model;
using WebEditor.Model;
using WebEditor.Model.DTO;

namespace WebEditor;

public class SessionService
{
    private Dictionary<string, CustomizedNetwork> Cache = new Dictionary<string, CustomizedNetwork>();
    private readonly NetworkService NetworkService;
    public SessionService(NetworkService networkService)
    {
        NetworkService = networkService;
    }

    public string NewSession()
    {
        INetworkManager? manager = NetworkService.GetNetworkManager();
        if(manager == null)
            throw new Exception("Network manager is not ready");
        
        string sessionId = Guid.NewGuid().ToString();
        Cache.Add(sessionId, (CustomizedNetwork)manager.NewCustomizedNetwork());
        return sessionId;
    }

    public bool HasSession(string? sessionId)
    {

        return sessionId != null && Cache.ContainsKey(sessionId);
    }

    public void UpdateCustomization(RoadNetworkCustomization roadNetworkCustomization, string sessionId)
    {
        Cache[sessionId].UpdateCustomization(roadNetworkCustomization);
    }
    public CustomizedNetwork GetSessionNetwork(string sessionId)
    {
        return Cache[sessionId];
    }

}