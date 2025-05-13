namespace InterRapidisimo_api.Services.ServiceSwagger
{
    public static class ServiceSwagger
    {
        public static IServiceCollection AddSwaggerService(this IServiceCollection services)
        {

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            return services;

        }
    }
}
