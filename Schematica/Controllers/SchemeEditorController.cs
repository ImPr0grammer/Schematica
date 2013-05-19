using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Web.Script.Serialization;

namespace Schematica.Controllers
{
    public class SchemeEditorController : Controller
    {
        //
        // GET: /SchemeEditor/

        private const string _file = @"C:\work\Scheme.json";

        public ActionResult Index()
        {
            var json = System.IO.File.ReadAllLines(_file)[0];

            ViewBag.Scheme = json;

            return View();
        }

        public JsonResult Save(string file)
        {
            System.IO.File.WriteAllLines(_file, new[] {file});
            return Json(null);
        }

        public JsonResult Get()
        {
            var json = System.IO.File.ReadAllLines(_file)[0];

            var content = new JavaScriptSerializer().DeserializeObject(json);
            return Json(content);
        }
    }
}
