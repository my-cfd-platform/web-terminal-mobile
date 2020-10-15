FROM monfex/web-app-hosting:1
ARG $BUILD_VERSION
ENV BUILD_VERSION=$BUILD_VERSION
WORKDIR /app
COPY wwwroot /app/wwwroot