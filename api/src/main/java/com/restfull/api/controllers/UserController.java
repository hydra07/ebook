package com.restfull.api.controllers;

import java.util.List;

import com.restfull.api.dtos.user.UserRequestDTO;
import com.restfull.api.dtos.user.UserResponseDTO;
import com.restfull.api.entities.Book;
import com.restfull.api.services.BookService;
import com.restfull.api.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.restfull.api.dtos.user.UserDTO;
import com.restfull.api.entities.User;
import com.restfull.api.services.UserService;
@RestController
@RequestMapping("/user")
public class UserController { 
    @Autowired
    private UserService service;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private BookService bookService;
    @GetMapping("/getAll")
    public ResponseEntity<List<UserDTO>> findAll() {
        final List<User> users = service.findAll();
        final List<UserDTO> dtos = users.stream().map(UserDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO dto) {
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        return ResponseEntity.ok(service.create(dto));
    }
    public ResponseEntity<UserDTO> update(@RequestBody UserDTO dto) {
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestHeader("Authorization") String token){
        token = jwtService.validateRequestHeader(token);
        return ResponseEntity.ok(new UserResponseDTO(jwtService.getUser(token)));
    }

//    @PostMapping("/profile")
//    public ResponseEntity<?> profile(@RequestHeader("Authorization") String token, @RequestBody UserRequestDTO dto){
//        try {
//            User user = jwtService.getUser(jwtService.validateRequestHeader(token));
//        }
//        catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
    @PostMapping("/followBook/{id}")
    public ResponseEntity<?> followBook(@RequestHeader("Authorization") String token, @PathVariable Long id){
        try {
            User user = jwtService.getUser(jwtService.validateRequestHeader(token));
            Book book = bookService.findById(id);
            bookService.addFollowedUser(book, user);
            return ResponseEntity.ok(new UserResponseDTO(service.findById(user.getId())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/unfollowBook/{id}")
    public ResponseEntity<?> unfollowBook(@RequestHeader("Authorization") String token, @PathVariable Long id){
        try {
            User user = jwtService.getUser(jwtService.validateRequestHeader(token));
            Book book = bookService.findById(id);
            bookService.removeFollowedUser(book, user);
            return ResponseEntity.ok(new UserResponseDTO(service.findById(user.getId())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

