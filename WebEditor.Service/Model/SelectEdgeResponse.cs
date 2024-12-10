using NetTopologySuite.Geometries;
using WebEditor.Model.DTO;

namespace WebEditor.Model;
public class SelectEdgeResponse
{
    public bool HasResult { get; set; }
    public float Distance { get; set; }
    public int ForwardSpeed { get; set; }
    public int BackwardSpeed { get; set; } 
    public List<int> Years { get; set; } = new List<int>();
    public AttributeDTO Attribute { get; set; } = new AttributeDTO();
    public LineString Segments { get; set; } = LineString.Empty;
    public float[] Connection { get; set; } = new float[2];

    public static SelectEdgeResponse NoResult = new SelectEdgeResponse { HasResult = false };
 }
