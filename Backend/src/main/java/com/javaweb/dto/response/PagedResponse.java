package com.javaweb.dto.response;

import java.util.Collections;
import java.util.List;

/**
 * Generic response wrapper for paginated APIs.
 *
 * @param <T> item type
 */
public class PagedResponse<T> {
    private final List<T> items;
    private final int currentPage;
    private final int pageSize;
    private final long totalItems;
    private final int totalPages;

    public PagedResponse(List<T> items, int currentPage, int pageSize, long totalItems) {
        this.items = items == null ? Collections.emptyList() : List.copyOf(items);
        this.currentPage = Math.max(currentPage, 0);
        this.pageSize = Math.max(pageSize, 0);
        this.totalItems = Math.max(totalItems, 0);
        if (this.pageSize > 0) {
            long pages = (this.totalItems + this.pageSize - 1) / this.pageSize;
            this.totalPages = (int) Math.max(pages, 0);
        } else {
            this.totalPages = 0;
        }
    }

    public List<T> getItems() {
        return items;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public int getTotalPages() {
        return totalPages;
    }
}

