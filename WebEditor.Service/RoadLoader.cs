using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
using Pipos.GeoLib.Core;
using Pipos.GeoLib.Core.Model;
using Pipos.GeoLib.Core.Api;
using Pipos.GeoLib.Road;
using Pipos.GeoLib.Road.Model;

namespace WebEditor;
public class RoadLoader : IHostedService
{
    private readonly NetworkService NetworkService;
    public RoadLoader(NetworkService networkService)
    {
        NetworkService = networkService;
    }
    public Task StartAsync(CancellationToken cancellationToken)
    {
        ILoader loader = new Loader();
        loader
            .FromGeoJunkJill(new Uri("https://pipos.tillvaxtverket.se/infra/"), new YearSet(new Year(2023)))
            .FromGeoJunkJill(new Uri("https://pipos.tillvaxtverket.se/infra/"), new YearSet(new Year(2024)));

        var networkManager = loader.BuildNetworkManager();
        NetworkService.SetNetworkManager(networkManager);

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
