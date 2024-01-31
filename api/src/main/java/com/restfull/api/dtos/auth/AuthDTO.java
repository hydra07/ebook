package com.restfull.api.dtos.auth;

import com.restfull.api.dtos.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthDTO {
    private String token;
    private String message;
    private UserDTO user;
}
