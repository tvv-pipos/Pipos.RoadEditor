using NetTopologySuite.Geometries;
using Pipos.GeoLib.Core.Api;
using Pipos.GeoLib.Core.Model;

namespace WebEditor.Model;
public class ModifyRoadResponse
{
    public bool HasResult { get; set; }
    public SelectEdgeResponse Start { get; set; } = SelectEdgeResponse.NoResult;
    public LineString LineString { get; set; } = LineString.Empty;
}
