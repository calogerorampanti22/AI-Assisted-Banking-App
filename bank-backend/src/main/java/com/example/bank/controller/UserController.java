package com.example.bank.controller;

import com.example.bank.dto.PasswordUpdateDto;
import com.example.bank.model.User;
import com.example.bank.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userService.findByEmail(userDetails.getUsername());

        // Return a map instead of the User object to avoid exposing password hash and
        // roles unnecessarily
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("nationality", user.getNationality());
        response.put("birthday", user.getBirthday());
        response.put("birthPlace", user.getBirthPlace());
        response.put("idCardNumber", user.getIdCardNumber());
        response.put("taxId", user.getTaxId());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordUpdateDto passwordUpdateDto) {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            User user = userService.findByEmail(userDetails.getUsername());

            userService.updatePassword(user.getId(), passwordUpdateDto.getOldPassword(),
                    passwordUpdateDto.getNewPassword());

            return ResponseEntity.ok(Map.of("message", "Password aggiornata con successo"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
