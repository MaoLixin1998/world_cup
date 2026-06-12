package com.worldcup.service.fan.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.worldcup.api.fan.request.CreateFanUserRequest;
import com.worldcup.api.fan.response.FanUserResponse;
import com.worldcup.dal.fan.repository.impl.InMemoryFanUserRepository;
import com.worldcup.service.fan.service.FanUserService;
import org.junit.jupiter.api.Test;

class FanUserServiceImplTest {
    @Test
    void createsFanIdentityWhenUidIsNew() {
        FanUserService service = new FanUserServiceImpl(new InMemoryFanUserRepository());

        FanUserResponse response = service.createFan(new CreateFanUserRequest("mei-10", "小梅迷", "messi"));

        assertEquals("mei-10", response.uid());
        assertEquals("小梅迷", response.nickname());
        assertEquals("messi", response.avatarPlayerId());
    }

    @Test
    void rejectsDuplicatedUid() {
        FanUserService service = new FanUserServiceImpl(new InMemoryFanUserRepository());
        service.createFan(new CreateFanUserRequest("mei-10", "小梅迷", "messi"));

        IllegalArgumentException error = assertThrows(
            IllegalArgumentException.class,
            () -> service.createFan(new CreateFanUserRequest("mei-10", "另一个昵称", "haaland"))
        );

        assertEquals("UID 已存在", error.getMessage());
    }
}
