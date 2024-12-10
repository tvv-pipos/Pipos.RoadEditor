using System;
using System.Linq;
using NetTopologySuite.Geometries;
using SkiaSharp;
using Pipos.GeoLib.Core.Api;
using Pipos.GeoLib.Core.Model;
using Pipos.GeoLib.Road;
using WebEditor.Model;
using WebEditor.Model.DTO;

namespace WebEditor;

public class RoadService
{
    private static float tileSize = 256;
    private static float[] extent = { 180296, 6106230, 1074900, 7791212 };
    private static float[] resolutions = { 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2 };
    private readonly SessionService SessionService;

    public RoadService(SessionService sessionService)
    {
        SessionService = sessionService;
    }

    public SelectEdgeResponse SelectEdge(SelectEdgeRequest request, string sessionId)
    {
        var network = SessionService.GetSessionNetwork(sessionId);
        var options = new QueryOptions();
        var rule = new ConnectionRule
        {
            NoDisconnectedIsland = false,
            NoFerry = false,
            NoOneWay = false,
            NoMotorway = false,
            OnlyDisconnectedIsland = false
        };
        var connection = network.Connect.Point(0, request.X, request.Y, 250, new Year(request.Year), rule);

        return GetEdgeResponse(connection);
    }

    public MesureResponse MesureTimeDistance(MesureRequest request, string sessionId)
    {
        var network = SessionService.GetSessionNetwork(sessionId);
        var response = new MesureResponse();      
        var options = new QueryOptions 
        {
            AllowBidirectionalTravel = request.AllowBidirectionalTravel,
            IncludeConnectionDistance = request.IncludeConnectionDistance, 
            ConnectionSpeed = request.ConnectionSpeed 
        };
        var year = new Year(request.Year);

        var rule = new ConnectionRule
        {
            NoDisconnectedIsland = false,
            NoFerry = false,
            NoOneWay = false,
            NoMotorway = false,
            OnlyDisconnectedIsland = false
        };

        var start = network.Connect.Point(0, request.StartX, request.StartY, request.MaxConnectionDistance, year, rule);
        var end = network.Connect.Point(1, request.EndX, request.EndY, request.MaxConnectionDistance, year, rule);

        response.Shortest = network.FindShortestLineString(start, end, year, options);
        response.Fastest = network.FindFastestLineString(start, end, year, options);
        response.HasResult = response.Fastest.HasResult && response.Shortest.HasResult;
        return response;
    }
    public SKImage GetTile(int x, int y, int z, Year year, string sessionId)
    {
        var network = SessionService.GetSessionNetwork(sessionId);
        CustomizedConnectionIndex connectionIndex = (CustomizedConnectionIndex)network.Connect;
        Envelope envelope = CreateEnvelope(x, y, z);

        using (var surface = SKSurface.Create(new SKImageInfo(256, 256)))
        {
            SKCanvas canvas = surface.Canvas;
            using var paint = new SKPaint
            {
                IsAntialias = true,
                Color = new SKColor(96, 96, 96),
                Style = SKPaintStyle.Stroke,
                StrokeWidth = 1
            };

            float xScale = 256f/((float)envelope.MaxX - (float)envelope.MinX);
            float yScale = 256f/((float)envelope.MaxY - (float)envelope.MinY);

            IList<Edge> edges = connectionIndex.RTree.Query(envelope).Where(e => e.Years.HasYear(year)).ToList();
            
            foreach(var e in edges)
            {
                var path = new SKPath();
                path.MoveTo(
                    (e.Segments[0].X - (float)envelope.MinX) * xScale, 
                    ((float)envelope.MaxY - e.Segments[0].Y) * yScale);

                for(int i = 1; i < e.Segments.Length; i++)
                {
                    path.LineTo(
                        (e.Segments[i].X - (float)envelope.MinX) * xScale, 
                        ((float)envelope.MaxY - e.Segments[i].Y) * yScale);
                }

                canvas.DrawPath(path, paint);
            }

            return surface.Snapshot();
        }
    }

    public NewRoadResponse NewRoad(SelectRoadRequest request, string sessionId)
    {
        var network = SessionService.GetSessionNetwork(sessionId);
        var response = new NewRoadResponse { HasResult = false };
        var options = new QueryOptions();
        var year = new Year(request.Year);
        var rule = new ConnectionRule
        {
            NoDisconnectedIsland = false,
            NoFerry = false,
            NoOneWay = false,
            NoMotorway = false,
            OnlyDisconnectedIsland = false
        };

        if(request.LineString.Coordinates.Length >= 2)
        {        
            var sc = request.LineString.Coordinates[0];
            var ec = request.LineString.Coordinates[request.LineString.Coordinates.Length - 1];

            var start = network.Connect.Point(0, (float)sc.X, (float)sc.Y, 250, year, rule);
            var end = network.Connect.Point(0, (float)ec.X, (float)ec.Y, 250, year, rule);

            response.Start = GetEdgeResponse(start);
            response.End = GetEdgeResponse(end);
            response.HasResult = response.Start.HasResult && response.End.HasResult;
        }
        return response;
    }

    public ModifyRoadResponse ModifyRoad(SelectRoadRequest request, string sessionId)
    {
        var network = SessionService.GetSessionNetwork(sessionId);
        var response = new ModifyRoadResponse { HasResult = false };
        var options = new QueryOptions();
        var year = new Year(request.Year);
        var rule = new ConnectionRule
        {
            NoDisconnectedIsland = false,
            NoFerry = false,
            NoOneWay = false,
            NoMotorway = false,
            OnlyDisconnectedIsland = false
        };

        if(request.LineString.Coordinates.Length >= 2)
        {        
            var sc = request.LineString.Coordinates[0];

            var start = network.Connect.Point(0, (float)sc.X, (float)sc.Y, 250, year, rule);
            var edge = network.SelectEdge(request.LineString, year);

            response.Start = GetEdgeResponse(start);
            if(edge.HasResult) 
            {
                response.LineString = edge.LineString;
                response.HasResult = true;
            }
        }
        return response;
    }
    public RemoveRoadResponse RemoveRoad(SelectRoadRequest request, string sessionId)
    {
        var network = SessionService.GetSessionNetwork(sessionId);
        var response = new RemoveRoadResponse { HasResult = false };
        var year = new Year(request.Year);

        if(request.LineString.Coordinates.Length >= 2)
        {        
            var edge = network.SelectEdge(request.LineString, year);
            if(edge.HasResult) 
            {
                response.LineString = edge.LineString;
                response.HasResult = true;
            }
        }
        return response;
    }

    private Envelope CreateEnvelope(int x, int y, int z)
    {
        float resolution = resolutions[z];
        float originX = extent[0];
        float originY = extent[3]; 

        float minX = originX + x * tileSize * resolution;
        float maxY = originY - y * tileSize * resolution;
        float maxX = originX + (x + 1) * tileSize * resolution;
        float minY = originY - (y + 1) * tileSize * resolution;

        return new Envelope(minX, maxX, minY, maxY);
    }

    private float PixelTransform(float a, float b, float v)
    {
        return MathF.Round(((v - a) / (b - a)) * 256.0f);
    }

    private SelectEdgeResponse GetEdgeResponse(IConnection connection)
    {
        var conn = (Connection)connection;
        SelectEdgeResponse response = new SelectEdgeResponse { HasResult = false };
        if(connection.IsConnected())
        {   
            var point = conn?.Connections?.First();
            Edge? e = point?.Edge;
            if(e != null)
            { 
                response.Distance = e.Distance;
                response.ForwardSpeed = e.ForwardSpeed;
                response.BackwardSpeed = e.BackwardSpeed;
                response.Years = e.Years.GetYears();
                response.Attribute = new AttributeDTO {
                    Class = e.Attribute.Class,
                    Ferry = e.Attribute.Ferry,
                    ForwardProhibited = e.Attribute.ForwardProhibited,
                    BackwardProhibited = e.Attribute.BackwardProhibited,
                    Motorway = e.Attribute.Motorway,
                    DisconnectedIsland = e.Attribute.DisconnectedIsland
                };
                response.HasResult = true;
                response.Segments = e.ToLineString();
                if(point != null) {
                    response.Connection[0] = point.X;
                    response.Connection[1] = point.Y;
                }
            }
        }
        return response;
    }
}