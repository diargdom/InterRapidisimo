namespace InterRapidisimo_api.Services.ServiceController
{
    public static class ServiceController
    {
        public static IServiceCollection AddControllerService(this IServiceCollection services)
        {
            services.AddControllers();

            return services;
        }
    }
}
