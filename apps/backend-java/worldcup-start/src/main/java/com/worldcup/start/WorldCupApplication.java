package com.worldcup.start;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Java 主业务后端启动类。
 *
 * <p>start 模块只负责应用入口和外部适配，业务规则放在 service 模块。
 */
@SpringBootApplication(scanBasePackages = "com.worldcup")
public class WorldCupApplication {
    public static void main(String[] args) {
        SpringApplication.run(WorldCupApplication.class, args);
    }
}
