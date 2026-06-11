# 构建阶段使用 Gradle 官方镜像。实际拉取前需要确认 Docker Hub 代理或镜像加速配置。
FROM gradle:8.14.3-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon

# 运行阶段只保留 JRE 和业务 jar，减小单机部署时的镜像体积。
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
