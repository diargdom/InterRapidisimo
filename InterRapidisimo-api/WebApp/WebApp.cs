using InterRapidisimo_api.Endpoints;

namespace InterRapidisimo_api.WebApp
{
    public static class WebApp
    {
        public static WebApplication ConfigureApplication(this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.MapAuthEndpoints();
            app.MapStudentEndpoints();
            app.UseCors("AllowAll");

            /*************EndPoint*****************/
            app.MapGet("/", () => "Backend InterRapidisimo Up!").WithSummary("➡ Levantamiento del Backend").WithTags("InterRapidisimo");

            return app;
        }
    }
}
