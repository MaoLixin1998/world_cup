# 构建阶段使用 Gradle 官方镜像。实际拉取前需要确认 Docker Hub 代理或镜像加速配置。
FROM gradle:8.14.3-jdk21 AS build
WORKDIR /app

# 多模块 Gradle 工程需要从 backend-java 根目录构建，所以 Docker build context 保持为 apps/backend-java。
COPY . .
RUN gradle :worldcup-start:bootJar --no-daemon

# 运行阶段只保留 JRE 和 start 模块生成的业务 jar，减小单机部署时的镜像体积。
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/worldcup-start/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
