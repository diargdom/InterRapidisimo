using InterRapidisimo_api.Services;
using InterRapidisimo_api.WebApp;

var builder = WebApplication.CreateBuilder(args);
//Configuración de servicios en el contenedor de inyección de dependencias (DI)
builder.Services.AddServicesGeneral(builder.Configuration);

var app = builder.Build();
app.ConfigureApplication();

app.Run();
