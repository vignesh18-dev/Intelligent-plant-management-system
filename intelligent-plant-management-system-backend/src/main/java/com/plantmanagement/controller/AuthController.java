package com.plantmanagement.controller;

import com.plantmanagement.entity.User;
import com.plantmanagement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://plant-management-frontend-m7hg.onrender.com"
}) // for your React app
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CLIENT"); // default role
        }

        userRepository.save(user);

        return ResponseEntity.ok("Registered successfully!");
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElse(null);

        if (user == null || !user.getPassword().equals(req.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        // send role to frontend
        return ResponseEntity.ok(Map.of(
                "message", "Login success",
                "role", user.getRole(),
                "userId", user.getId()
        ));
    }


    @GetMapping("/test")
    public ResponseEntity<String> testApi() {
        return ResponseEntity.ok("AuthController is working fine ✅");
    }
}