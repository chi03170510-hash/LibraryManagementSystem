package com.javaweb.service;

import com.javaweb.dto.request.CategoryRequest;
import com.javaweb.dto.response.CategoryResponse;

import java.util.List;

public interface ICategoryService {
    List<CategoryResponse> findAll();
    String createCategory(CategoryRequest categoryRequest);
    String updateCategory(Integer id, CategoryRequest categoryRequest);
    String deleteCategory(Integer id);
}
