package com.javaweb.security;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityContextCurrentUserProvider implements CurrentUserProvider {

    @Override
    public String getCurrentUsername() {
        return getCurrentUsernameOptional()
                .orElseThrow(() -> new IllegalStateException("No authenticated user found in security context"));
    }

    @Override
    public Optional<String> getCurrentUsernameOptional() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof String && "anonymousUser".equals(principal)) {
            return Optional.empty();
        }
        return Optional.ofNullable(authentication.getName());
    }
}
