
namespace WebEditor.Model;
public class MesureRequest
{
    public float StartX { get; set; }
    public float StartY { get; set; }
    public float EndX { get; set; }
    public float EndY { get; set; }
    public int Year { get; set; }
    public bool IncludeConnectionDistance { get; set; }
    public bool AllowBidirectionalTravel { get; set; }
    public float MaxConnectionDistance { get; set; }
    public float ConnectionSpeed { get; set; }
}
