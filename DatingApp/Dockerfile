FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish -c Debug -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:3.1 as final
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "DatingApp.dll"]