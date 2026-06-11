package com.worldcup.health;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HealthControllerTest {
    @Test
    void healthReturnsOkStatus() {
        HealthController controller = new HealthController();

        HealthController.HealthResponse response = controller.health();

        assertThat(response.status()).isEqualTo("ok");
        assertThat(response.service()).isEqualTo("backend-java");
    }
}
