package com.worldcup.fan;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Optional;

import org.junit.jupiter.api.Test;

class FanUserServiceTest {
    @Test
    void createsFanWhenUidDoesNotExist() {
        // 用内存仓库做测试，不依赖数据库；这样学习时能先看懂业务规则本身。
        InMemoryFanUserRepository repository = new InMemoryFanUserRepository();
        FanUserService service = new FanUserService(repository);

        FanUser fan = service.createFan("mei-10", "小梅迷", "messi");

        assertThat(fan.uid()).isEqualTo("mei-10");
        assertThat(fan.nickname()).isEqualTo("小梅迷");
        assertThat(fan.avatarPlayerId()).isEqualTo("messi");
    }

    @Test
    void rejectsDuplicateUid() {
        InMemoryFanUserRepository repository = new InMemoryFanUserRepository();
        FanUserService service = new FanUserService(repository);
        service.createFan("mei-10", "小梅迷", "messi");

        assertThatThrownBy(() -> service.createFan("mei-10", "另一个球迷", "mbappe"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("UID 已存在");
    }

    private static class InMemoryFanUserRepository implements FanUserRepository {
        private FanUser stored;

        @Override
        public Optional<FanUser> findByUid(String uid) {
            return Optional.ofNullable(stored).filter(fan -> fan.uid().equals(uid));
        }

        @Override
        public FanUser save(FanUser fanUser) {
            stored = fanUser;
            return fanUser;
        }
    }
}
