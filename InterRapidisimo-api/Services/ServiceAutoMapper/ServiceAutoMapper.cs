namespace InterRapidisimo_api.Services.ServiceAutoMapper
{
    public static class ServiceAutoMapper
    {
        public static IServiceCollection AddAutoMapperService(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(Program).Assembly);
            return services;
        }
    }
}
