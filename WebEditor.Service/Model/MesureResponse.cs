using NetTopologySuite.Geometries;
using Pipos.GeoLib.Core.Api;
using Pipos.GeoLib.Core.Model;
using WebEditor.Model.DTO;

namespace WebEditor.Model;
public class MesureResponse
{
    public bool HasResult { get; set; }
    public ILineStringResult Shortest { get; set; } = LineStringResult.NoResult;
    public ILineStringResult Fastest { get; set; } = LineStringResult.NoResult;   
 }
