using NetTopologySuite.Geometries;

namespace WebEditor.Model;
public class SelectRoadRequest
{
    public LineString LineString { get; set; } = LineString.Empty;
    public int Year { get; set; }
}
