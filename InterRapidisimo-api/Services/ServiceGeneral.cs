using InterRapidisimo_api.Services.ServiceAuthentication;
using InterRapidisimo_api.Services.ServiceAuthorization;
using InterRapidisimo_api.Services.ServiceAutoMapper;
using InterRapidisimo_api.Services.ServiceController;
using InterRapidisimo_api.Services.ServiceCors;
using InterRapidisimo_api.Services.ServiceDB;
using InterRapidisimo_api.Services.ServiceScoped;
using InterRapidisimo_api.Services.ServiceSwagger;

namespace InterRapidisimo_api.Services
{
    public static class ServiceGeneral
    {
        public static IServiceCollection AddServicesGeneral(this IServiceCollection services, IConfiguration configuration)
        {
            // Configuración de conexiones a bases de datos
            services.AddDatabaseconnections(configuration);
            //Configuración de Servicios
            services.AddCorsService(configuration);
            services.AddAutoMapperService();
            services.AddScopedService();
            services.AddAuthenticationService(configuration);
            services.AddAuthorizationService();
            services.AddControllerService();
            services.AddSwaggerService();
            return services;
        }
    }
}
