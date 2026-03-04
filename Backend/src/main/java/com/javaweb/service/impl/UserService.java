package com.javaweb.service.impl;

import com.javaweb.constants.MessageConstants;
import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.PermissionDenyException;
import com.javaweb.models.entity.User;
import com.javaweb.enums.Role;
import com.javaweb.enums.UserStatus;
import com.javaweb.dto.common.UserDTO;
import com.javaweb.dto.common.UserLoginDTO;
import com.javaweb.repository.UserRepository;
import com.javaweb.security.CurrentUserProvider;
import com.javaweb.service.IUserService;
import com.javaweb.utils.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final CurrentUserProvider currentUserProvider;

    @Override
    public User createUser(UserDTO userDTO) throws Exception {
        String username = userDTO.getUsername();
        if (username != null && userRepository.existsByUsername(username)) {
            throw new DataIntegrityViolationException("Username already exists");
        }
        String phoneNumber = userDTO.getPhone();
        if (userRepository.existsByPhone(phoneNumber)) {
            throw new DataIntegrityViolationException("Phone number already exists");
        }
        User newUser = modelMapper.map(userDTO, User.class);
        newUser.setStatus(UserStatus.ACTIVE);
        newUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        return userRepository.save(newUser);
    }

    @Override
    public String login(UserLoginDTO userLoginDTO) throws Exception {
        Optional<User> optionalUser = userRepository.findByUsername(userLoginDTO.getUsername());
        if (optionalUser.isEmpty()) {
            throw new BadCredentialsException("Invalid username or password");
        }

        User existingUser = optionalUser.get();

        if(existingUser.getStatus() == UserStatus.INACTIVE){
            throw new DisabledException("Account is not active");
        }

        if (!passwordEncoder.matches(userLoginDTO.getPassword(), existingUser.getPassword())) {
            throw new BadCredentialsException("Wrong username or password");
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                userLoginDTO.getUsername(), userLoginDTO.getPassword()
        );
        authenticationManager.authenticate(authenticationToken);
        return jwtTokenProvider.generateToken(existingUser);
    }

    @Override
    public UserDTO getProfile() {
        String username = currentUserProvider.getCurrentUsername();
        return modelMapper.map(userRepository.findByUsername(username).orElseThrow(), UserDTO.class);
    }

    @Override
    public String updateProfile(UserDTO userDTO) {
        String username = currentUserProvider.getCurrentUsername();
        User user = userRepository.findByUsername(username).orElseThrow();

        boolean originalSkipNull = modelMapper.getConfiguration().isSkipNullEnabled();
        try {
            modelMapper.getConfiguration().setSkipNullEnabled(true);
            modelMapper.map(userDTO, user);
        } finally {
            modelMapper.getConfiguration().setSkipNullEnabled(originalSkipNull);
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        userRepository.save(user);
        return MessageConstants.PROFILE_UPDATED_SUCCESSFULLY;
    }

    @Override
    public String lockUserAccount(Integer id) throws DataNotFoundException, PermissionDenyException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id " + id));
        if (user.getRole() != Role.READER) {
            throw new PermissionDenyException("Only reader accounts can be locked.");
        }
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);
        return MessageConstants.USER_LOCKED_SUCCESSFULLY;
    }

    @Override
    public String unlockUserAccount(Integer id) throws DataNotFoundException, PermissionDenyException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id " + id));
        if (user.getRole() != Role.READER) {
            throw new PermissionDenyException("Only reader accounts can be unlocked.");
        }
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        return MessageConstants.USER_UNLOCKED_SUCCESSFULLY;
    }

    @Override
    public List<UserDTO> getAllReader() {
        List<User> readers = userRepository.findAllByRole(Role.READER);
        return readers.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .toList();
    }
}




