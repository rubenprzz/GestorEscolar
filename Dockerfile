FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["WebApplication1/WebApplication1.csproj", "WebApplication1/"]
RUN dotnet restore "WebApplication1/WebApplication1.csproj"

# Copiar todo el proyecto
COPY . .

# DEBUG: Verificar que wwwroot se copió correctamente
RUN echo "=== DEBUGGING: Contenido de /src/WebApplication1/wwwroot/ ===" && \
    ls -la /src/WebApplication1/wwwroot/ && \
    echo "=== FIN DEBUG ===" 

WORKDIR "/src/WebApplication1"
RUN dotnet publish "WebApplication1.csproj" -c Release -o /app/publish /p:UseAppHost=false

# DEBUG: Verificar contenido después del publish
RUN echo "=== DEBUGGING: Contenido de /app/publish/wwwroot/ ===" && \
    ls -la /app/publish/wwwroot/ && \
    echo "=== FIN DEBUG ===" 

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# DEBUG: Verificar contenido final
RUN echo "=== DEBUGGING: Contenido final de /app/wwwroot/ ===" && \
    ls -la /app/wwwroot/ && \
    echo "=== FIN DEBUG ===" 

ENTRYPOINT ["dotnet", "WebApplication1.dll"]