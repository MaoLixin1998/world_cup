package com.worldcup.start.health.response;

/**
 * 健康检查接口返回对象。
 *
 * <p>response 包放 Controller 返回给 HTTP 调用方的数据结构。即使它很小，也单独建类，
 * 这样 Controller 就只负责接请求和返回结果，不顺手定义数据结构。
 */
public record HealthResponse(String status, String service) {
}
