pluginManagement {
    repositories {
        // 中国大陆开发环境优先使用阿里云镜像，减少 Gradle 插件解析失败。
        maven { url = uri("https://maven.aliyun.com/repository/gradle-plugin") }
        maven { url = uri("https://maven.aliyun.com/repository/public") }
        gradlePluginPortal()
        mavenCentral()
    }
}

dependencyResolutionManagement {
    // 用户工具目录中已有 china-mirrors.gradle 会注入国内仓库；这里选择 settings 优先，
    // 避免和全局镜像脚本冲突，同时仍让本项目声明的镜像源具备最高优先级。
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        // 依赖下载同样先走国内镜像，官方 Maven Central 只作为兜底。
        maven { url = uri("https://maven.aliyun.com/repository/public") }
        maven { url = uri("https://maven.aliyun.com/repository/spring") }
        mavenCentral()
    }
}

rootProject.name = "backend-java"
