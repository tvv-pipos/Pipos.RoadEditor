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
            .FromFile("/workspace/Tillvaxtvarket20080101.bin", new YearSet(new Year(2008)))
            .FromFile("/workspace/Tillvaxtvarket20140101.bin", new YearSet(new Year(2014)))
            .FromFile("/workspace/Tillvaxtvarket20200101.bin", new YearSet(new Year(2020)))
            .FromFile("/workspace/tillganglighetsvagnat_210101.bin", new YearSet(new Year(2021)))
            .FromFile("/workspace/tillganglighetsvagnat_220101.bin", new YearSet(new Year(2022)))
            .FromFile("/workspace/Tillvaxtvarket20230101.bin", new YearSet(new Year(2023)))
            .FromFile("/workspace/Tillganglighetsvagnat_240101.bin", new YearSet(new Year(2024)));

        var networkManager = loader.BuildNetworkManager();
        NetworkService.SetNetworkManager(networkManager);

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
