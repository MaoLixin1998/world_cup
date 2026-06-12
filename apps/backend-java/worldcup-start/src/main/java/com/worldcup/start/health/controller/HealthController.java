package com.worldcup.start.health.controller;

import com.worldcup.start.health.response.HealthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 健康检查入口。
 *
 * <p>controller 包只放 HTTP 入口。Controller 负责接收请求、调用服务、返回响应；
 * 不应该承载业务逻辑，也不应该把返回对象定义成内部类。
 */
@RestController
public class HealthController {
    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    @GetMapping("/api/health")
    public HealthResponse health() {
        log.debug("收到后端健康检查请求");
        return new HealthResponse("ok", "backend-java");
    }
}
