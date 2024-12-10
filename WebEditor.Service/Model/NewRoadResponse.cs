using NetTopologySuite.Geometries;
using Pipos.GeoLib.Core.Api;
using Pipos.GeoLib.Core.Model;

namespace WebEditor.Model;
public class NewRoadResponse
{
    public bool HasResult { get; set; }
    public SelectEdgeResponse Start { get; set; } = SelectEdgeResponse.NoResult;
    public SelectEdgeResponse End { get; set; } = SelectEdgeResponse.NoResult;
}
