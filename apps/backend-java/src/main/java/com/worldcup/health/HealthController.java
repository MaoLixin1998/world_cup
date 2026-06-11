package com.worldcup.health;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    @GetMapping("/api/health")
    public HealthResponse health() {
        log.debug("收到后端健康检查请求");
        return new HealthResponse("ok", "backend-java");
    }

    public record HealthResponse(String status, String service) {
    }
}
