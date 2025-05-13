using InterRapidisimo_api.Context.ContextInterRapidisimo;
using Microsoft.EntityFrameworkCore;

namespace InterRapidisimo_api.Services.ServiceDB
{
    public static class DatabaseConfigurationExtensions
    {
        public static IServiceCollection AddDatabaseconnections(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<InterRapidisimoContext>(a => a.UseSqlServer(configuration.GetConnectionString("ConnectionLocal")));

            return services;
        }
    }
}
