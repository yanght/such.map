using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Szcg.Map.Startup))]
namespace Szcg.Map
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
