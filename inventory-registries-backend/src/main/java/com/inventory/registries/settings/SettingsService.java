package com.inventory.registries.settings;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.registries.common.exception.ResourceNotFoundException;
import com.inventory.registries.security.Role;
import com.inventory.registries.security.User;
import com.inventory.registries.security.UserRepository;

@Service
public class SettingsService {

    private final UserRepository userRepository;

    public SettingsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // LIST USERS
    public List<UserSettingsDTO> listUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> new UserSettingsDTO(
                        u.getId(),
                        u.getUsername(),
                        u.getRole()
                ))
                .toList();
    }

    // UPDATE ROLE
    public UserSettingsDTO updateRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setRole(role);
        userRepository.save(user);

        return new UserSettingsDTO(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }
}
