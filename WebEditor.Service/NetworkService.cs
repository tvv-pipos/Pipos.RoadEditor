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

public class NetworkService
{
    private INetworkManager? NetworkManager = null;
    public NetworkService()
    {

    }
    public void SetNetworkManager(INetworkManager networkManager)
    {
        NetworkManager = networkManager;
    }

    public INetworkManager? GetNetworkManager()
    {
        return NetworkManager;
    }
}