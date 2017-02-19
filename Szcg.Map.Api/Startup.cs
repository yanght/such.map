using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Szcg.Map.Api.Startup))]
namespace Szcg.Map.Api
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
