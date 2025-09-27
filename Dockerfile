FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiamos solo el csproj primero para cachear restore
COPY ["WebApplication1/WebApplication1.csproj", "WebApplication1/"]

RUN dotnet restore "WebApplication1/WebApplication1.csproj"

# Ahora copiamos el resto
COPY . .

WORKDIR "/src/WebApplication1"

RUN dotnet build "WebApplication1.csproj" -c Release -o /app/build
RUN dotnet publish "WebApplication1.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WebApplication1.dll"]
