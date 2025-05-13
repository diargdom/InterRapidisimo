using InterRapidisimo_api.Interface;
using InterRapidisimo_api.Methods;

namespace InterRapidisimo_api.Services.ServiceScoped
{
    public static class ServiceScoped
    {
        public static IServiceCollection AddScopedService(this IServiceCollection services)
        {
            services.AddScoped<IAuthRepository, AuthRepository>();;
            return services;
        }
    }
}
