package com.inventory.registries.security;

import com.inventory.registries.security.dto.LoginRequest;
import com.inventory.registries.security.dto.LoginResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        String role = userDetails
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority(); // ROLE_ADMIN etc.

        String token = jwtUtil.generateToken(
                userDetails.getUsername(),
                java.util.List.of(role)
        );

        return ResponseEntity.ok(
                new LoginResponse(token, role)
        );
    }
}
