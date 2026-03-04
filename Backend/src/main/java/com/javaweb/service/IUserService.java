package com.javaweb.service;

import com.javaweb.customexceptions.DataNotFoundException;
import com.javaweb.customexceptions.PermissionDenyException;
import com.javaweb.models.entity.User;
import com.javaweb.dto.common.UserDTO;
import com.javaweb.dto.common.UserLoginDTO;

import java.util.List;

public interface IUserService {
    User createUser(UserDTO userDTO) throws Exception;
    String login(UserLoginDTO userLoginDTO) throws Exception;
    UserDTO getProfile();
    String updateProfile(UserDTO userDTO);
    String lockUserAccount(Integer id) throws DataNotFoundException, PermissionDenyException;
    String unlockUserAccount(Integer id) throws DataNotFoundException, PermissionDenyException;
    List<UserDTO> getAllReader();
}
