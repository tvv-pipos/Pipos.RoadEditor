using NetTopologySuite.Geometries;
using Pipos.GeoLib.Core.Api;
using Pipos.GeoLib.Core.Model;

namespace WebEditor.Model;
public class RemoveRoadResponse
{
    public bool HasResult { get; set; }
    public LineString LineString { get; set; } = LineString.Empty;
}
