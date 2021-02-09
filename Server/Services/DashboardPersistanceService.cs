using Reveal.Sdk;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace DynamicDashboardLoad.Server.Services
{
    public class DashboardPersistanceService : IDashboardPersistanceService
    {
        string _liveDashboardsLocation;
        public DashboardPersistanceService()
        {
            _liveDashboardsLocation = "LiveDashboards";
            EnsureLiveDashboards();
        }

        public DashboardPersistanceService(string liveDashboardsLocation)
        {
            _liveDashboardsLocation = liveDashboardsLocation;
        }

        public string LiveDashboardsLocation => _liveDashboardsLocation;

        public async Task<Dashboard> LoadDashboardAsync(string name)
        {
            var fileName = name.Split('|')[0];
            var dashboardFileName = fileName + ".rdash";
            var rdashLocation = "LiveDashboards/" + dashboardFileName;

            MemoryStream memStream = new MemoryStream();
            using (var fileStream = File.OpenRead(rdashLocation))
            {
                await fileStream.CopyToAsync(memStream);
            }
            memStream.Position = 0;

            return new Dashboard(memStream);
        }

        public async Task SaveDashboardAsync(string dashboardId, Dashboard dashboard)
        {
            var rdashTargetPath = Path.Combine(_liveDashboardsLocation, dashboardId + ".rdash");

            using (var output = File.Open(rdashTargetPath, FileMode.Create))
            {
                await(await dashboard.SerializeAsync()).CopyToAsync(output);
            }
        }

        public string[] GetAvailableDashboards()
        {
            return Directory.GetFiles(_liveDashboardsLocation).Select(name => ExtractFileName(name)).ToArray();
        }

        public bool IsDashboardNameAvailableForUse(string name)
        {
            var existingNames = this.GetAvailableDashboards();
            return !existingNames.Contains(name);
        }

        private void EnsureLiveDashboards()
        {
            if (Directory.Exists(_liveDashboardsLocation) && Directory.EnumerateFiles(_liveDashboardsLocation).Any())
            {
                Console.WriteLine("Dashboards present!");
            }
            else
            {
                Directory.CreateDirectory(_liveDashboardsLocation);
                Console.WriteLine("Dashboards missing. Initializing!");
                var assembly = Assembly.GetExecutingAssembly();
                var embeddedResources = assembly.GetManifestResourceNames();

                foreach (var rdashPath in embeddedResources.Where(path => path.Contains(".rdash")))
                {
                    var stream = assembly.GetManifestResourceStream(rdashPath);
                    var fileNameParts = rdashPath.Split('.');
                    var fileName = fileNameParts[fileNameParts.Length - 2] + ".rdash";

                    var fullPath = Path.Combine(_liveDashboardsLocation, fileName);
                    using (var output = File.Open(fullPath, FileMode.Create))
                    {
                        stream.CopyTo(output);
                    }
                }
            }
        }

        private string ExtractFileName(string filePath)
        {
            var fileName = Path.GetFileName(filePath);
            return fileName.Split('.')[0];
        }
    }
}
