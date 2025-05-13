namespace InterRapidisimo_api.Services.ServiceAuthorization
{
    public static class ServiceAuthorization
    {
        public static IServiceCollection AddAuthorizationService(this IServiceCollection services)
        {
            services.AddAuthorization();

            return services;
        }
    }
}
