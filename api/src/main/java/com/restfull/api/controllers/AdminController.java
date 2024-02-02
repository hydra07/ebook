package com.restfull.api.controllers;

import com.restfull.api.dtos.user.UserDTO;
import com.restfull.api.entities.User;
import com.restfull.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService service;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/getAll")
    public ResponseEntity<List<UserDTO>> findAll() {
        final List<User> users = service.findAll();
        final List<UserDTO> dtos = users.stream().map(UserDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
