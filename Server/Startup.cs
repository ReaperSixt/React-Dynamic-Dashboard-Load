using System.IO;
using Reveal.Sdk;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using DynamicDashboardLoad.Server.RevealSdk;
using DynamicDashboardLoad.Server.Services;

namespace DynamicDashboardLoad.Server
{
    public class Startup
    {
        private string _webRootPath;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            _webRootPath = env.WebRootPath;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var dashbaordPersispanceService = new DashboardPersistanceService();
            services.AddSingleton<IDashboardPersistanceService>(dashbaordPersispanceService);

            var embedSettings = new RevealEmbedSettings();
            embedSettings.LocalFileStoragePath = GetLocalFileStoragePath(_webRootPath);

            var cacheFilePath = Configuration.GetSection("Caching")?["CacheFilePath"] ?? @"Cache";
            Directory.CreateDirectory(cacheFilePath);
            embedSettings.DataCachePath = cacheFilePath;
            embedSettings.CachePath = cacheFilePath;
            services.AddRevealServices(embedSettings, CreateSdkContext());

            services.AddControllers().AddReveal();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseCors(builder => builder
             .AllowAnyOrigin()
             .AllowAnyMethod()
             .AllowAnyHeader());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "Home/About",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        protected virtual string GetLocalFileStoragePath(string webRootPath)
        {
            return Path.Combine(webRootPath, "App_Data", "RVLocalFiles");
        }
        protected virtual RevealSdkContextBase CreateSdkContext()
        {
            return new RevealSdkContext();
        }
    }
}
