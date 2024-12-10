using NetTopologySuite.Geometries;

namespace WebEditor.Model.DTO;
public class AttributeDTO
{
    public int Class { get; set; }
    public bool Ferry { get; set; }
    public bool ForwardProhibited { get; set; }
    public bool BackwardProhibited { get; set; }
    public bool Motorway { get; set; }
    public bool DisconnectedIsland { get; set; }
}
