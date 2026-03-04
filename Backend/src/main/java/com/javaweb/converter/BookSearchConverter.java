package com.javaweb.converter;

import com.javaweb.dto.request.BookSearchBuilder;
import com.javaweb.utils.MapUtil;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class BookSearchConverter {
    public BookSearchBuilder toBookSearchBuilder(Map<String, Object> request) {
        return new BookSearchBuilder.Builder()
                .setAuthor(MapUtil.getObject(request, "author", String.class))
                .setCategory(MapUtil.getObject(request, "category", String.class))
                .setTitle(MapUtil.getObject(request, "title", String.class))
                .setId(MapUtil.getObject(request, "id", Integer.class))
                .setYear(MapUtil.getObject(request, "publishedYear", Integer.class))
                .setPage(MapUtil.getObject(request, "page", Integer.class))
                .setSize(MapUtil.getObject(request, "size", Integer.class))
                .build();
    }
}
