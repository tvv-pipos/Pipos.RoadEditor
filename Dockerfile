FROM mcr.microsoft.com/dotnet/sdk:8.0 as dotnet-build-env

WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y npm
RUN dotnet publish -c Release -o /out WebEditor/WebEditor.csproj

FROM mcr.microsoft.com/dotnet/aspnet:8.0
ENV LANG=sv_SE.utf8

WORKDIR /app
RUN apt-get update && apt-get install -y \
    libfontconfig1 \
    libfreetype6 \
    locales \
    curl \
    libice6 \
    libsm6 \
    && localedef -i sv_SE -c -f UTF-8 -A /usr/share/locale/locale.alias sv_SE.UTF-8 \
    && rm -rf /var/lib/apt/lists/*
    
COPY --from=dotnet-build-env /out .

EXPOSE 80

ENTRYPOINT ["dotnet", "WebEditor.dll"]