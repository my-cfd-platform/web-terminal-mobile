FROM myjettools/web-app-host:0.1.0
ARG BUILD_VERSION
ENV BUILD_VERSION=$BUILD_VERSION
WORKDIR /app
COPY wwwroot ./wwwroot
