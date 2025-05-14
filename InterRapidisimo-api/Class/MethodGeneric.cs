
namespace InterRapidisimo_api.Class
{
    public class MethodGeneric
    {
        public static async Task<IResult> HandleSPRequest<T>(Func<Task<T>> spMethod)
        {
            try
            {
                var result = await spMethod();
                return Results.Ok(new ApiResponse<T>
                {
                    Success = true,
                    Data = result,
                    Message = "Operación exitosa"
                });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new ApiResponse<string>
                {
                    Success = false,
                    Data = null,
                    Message = "Error en la operación",
                    Errors = new List<ApiError>
                    {
                        new ApiError
                        {
                            Code = "SERVER_ERROR",
                            Message = ex.Message
                        }
                    }
                });
            }
        }

        public class ApiResponse<T>
        {
            public bool Success { get; set; }
            public T Data { get; set; }
            public string Message { get; set; }
            public List<ApiError> Errors { get; set; } = new();

            // Constructor sin parámetros para serialización
            public ApiResponse() { }

            // Constructor conveniente (opcional)
            public ApiResponse(bool success, T data, string message)
            {
                Success = success;
                Data = data;
                Message = message;
            }

            public ApiResponse(bool success, T data, string message, List<ApiError> errors)
            {
                Success = success;
                Data = data;
                Message = message;
                Errors = errors;
            }
        }

        public class ApiError
        {
            public string Code { get; set; }
            public string Message { get; set; }

            // Constructor sin parámetros para serialización
            public ApiError() { }

            // Constructor conveniente
            public ApiError(string code, string message)
            {
                Code = code;
                Message = message;
            }
        }
    }
}
