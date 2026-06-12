package com.worldcup.service.fan;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.worldcup.api.fan.CreateFanUserRequest;
import com.worldcup.api.fan.FanUserResponse;
import com.worldcup.dal.fan.InMemoryFanUserRepository;
import org.junit.jupiter.api.Test;

class FanUserFacadeImplTest {
    @Test
    void createsFanIdentityWhenUidIsNew() {
        FanUserFacadeImpl facade = new FanUserFacadeImpl(new InMemoryFanUserRepository());

        FanUserResponse response = facade.createFan(new CreateFanUserRequest("mei-10", "小梅迷", "messi"));

        assertEquals("mei-10", response.uid());
        assertEquals("小梅迷", response.nickname());
        assertEquals("messi", response.avatarPlayerId());
    }

    @Test
    void rejectsDuplicatedUid() {
        FanUserFacadeImpl facade = new FanUserFacadeImpl(new InMemoryFanUserRepository());
        facade.createFan(new CreateFanUserRequest("mei-10", "小梅迷", "messi"));

        IllegalArgumentException error = assertThrows(
            IllegalArgumentException.class,
            () -> facade.createFan(new CreateFanUserRequest("mei-10", "另一个昵称", "haaland"))
        );

        assertEquals("UID 已存在", error.getMessage());
    }
}
