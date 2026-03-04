package com.javaweb.security;

import java.util.Optional;

public interface CurrentUserProvider {
    String getCurrentUsername();
    Optional<String> getCurrentUsernameOptional();
}
