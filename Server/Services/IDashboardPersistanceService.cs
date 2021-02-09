using Reveal.Sdk;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DynamicDashboardLoad.Server.Services
{
    public interface IDashboardPersistanceService
    {
        string LiveDashboardsLocation { get; }

        Task<Dashboard> LoadDashboardAsync(string name);

        Task SaveDashboardAsync(string dashboardId, Dashboard dashboard);

        string[] GetAvailableDashboards();

        bool IsDashboardNameAvailableForUse(string name);

    }
}
