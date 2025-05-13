namespace InterRapidisimo_api.Endpoints
{
    public static class StudentEndpoint
    {
        public static void MapStudentEndpoints(this WebApplication app)
        {
            var student = app.MapGroup("/students")/*.RequireAuthorization()*/;

            //student.MapPost("/asignar-materias")
        }
    }
}
