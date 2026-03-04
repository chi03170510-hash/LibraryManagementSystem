package com.javaweb.service.impl;

import com.javaweb.constants.MessageConstants;
import com.javaweb.models.entity.Category;
import com.javaweb.dto.request.CategoryRequest;
import com.javaweb.dto.response.CategoryResponse;
import com.javaweb.repository.CategoryRepository;
import com.javaweb.service.ICategoryService;
import com.javaweb.utils.EntityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<CategoryResponse> findAll() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryResponse> responses = new ArrayList<>();
        for (Category category : categories) {
            CategoryResponse categoryResponse = modelMapper.map(category, CategoryResponse.class);
            responses.add(categoryResponse);
        }
        return responses;
    }

    @Override
    public String createCategory(CategoryRequest categoryRequest) {
        if (!EntityUtils.idMustBeNullAndOthersNotNull(categoryRequest)) {
            return MessageConstants.CATEGORY_DATA_INCOMPLETE;
        }
        Category category = modelMapper.map(categoryRequest, Category.class);
        categoryRepository.save(category);
        return MessageConstants.CATEGORY_CREATED_SUCCESSFULLY;
    }

    @Override
    public String updateCategory(Integer id, CategoryRequest categoryRequest) {
        ModelMapper localMapper = new ModelMapper();
        localMapper.getConfiguration().setSkipNullEnabled(true);
        Category category = categoryRepository.findById(id).orElseThrow();
        localMapper.map(categoryRequest, category);
        categoryRepository.save(category);
        return MessageConstants.CATEGORY_UPDATED_SUCCESSFULLY;
    }

    @Override
    public String deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
        return MessageConstants.CATEGORY_DELETED_SUCCESSFULLY;
    }
}
