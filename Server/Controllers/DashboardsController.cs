using DynamicDashboardLoad.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace DynamicDashboardLoad.Server.Controllers
{
    public class DashboardsController : Controller
    {
        IDashboardPersistanceService _dahboardPersistanceService;
        public DashboardsController(IDashboardPersistanceService dahboardPersistanceService)
        {
            _dahboardPersistanceService = dahboardPersistanceService;
        }
        public JsonResult GetDashboardsNames()
        {
            return Json(_dahboardPersistanceService.GetAvailableDashboards());
        }

        public JsonResult IsDashboardNameAvailableForUse(string name)
        {
            return Json(_dahboardPersistanceService.IsDashboardNameAvailableForUse(name));
        }
    }
}
