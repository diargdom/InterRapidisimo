using Microsoft.EntityFrameworkCore;

namespace InterRapidisimo_api.Services.ServiceDB
{
    public static class ServiceDB
    {
        public static IServiceCollection AddDatabaseconnections(this IServiceCollection services, IConfiguration configuration)
        {
            //services.AddDbContext<WinnerGroupDbContext>(a => a.UseSqlServer(configuration.GetConnectionString("ConnectionLocal")));

            return services;
        }
    }
}
