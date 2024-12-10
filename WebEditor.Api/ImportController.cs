using Microsoft.AspNetCore.Mvc;
using NetTopologySuite.Geometries;
using Pipos.GeoLib.Core.Api;
using Pipos.GeoLib.Core.Model;
using Pipos.GeoLib.Road;
using Pipos.GeoLib.Road.IO;
using Microsoft.AspNetCore.Authorization;

namespace WebEditor.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ImportController : ControllerBase
{
    public ImportController()
    {

    }

    [HttpGet]
    [Authorize]
    public void ImportGeoPackage()
    {
        string directoryPath = @"/workspace";

        if (!Directory.Exists(directoryPath))
        {
            Console.WriteLine($"The directory {directoryPath} does not exist.");
            return;
        }

        string[] gpkgFiles = Directory.GetFiles(directoryPath, "*.gpkg");

        foreach (var file in gpkgFiles)
        {
            new BinaryRoadCreator()
                .ImportGeoPackage(file)
                .SetFerrySpeed(6)
                .CalculateDisconnectedIslands()
                .Optimize()
                .Validate()
                .ExportToBinaryFile(Path.ChangeExtension(file, ".bin"));
        }

        if (gpkgFiles.Length == 0)
        {
            Console.WriteLine("No .gpkg files found in the directory.");
        }
    }
}
