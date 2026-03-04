package com.javaweb.dto.request;

public class BookSearchBuilder {
    private Integer id;
    private String title;
    private String author;
    private String category;
    private Integer year;
    private Integer page;
    private Integer size;

    private BookSearchBuilder(Builder builder) {
        this.id = builder.id;
        this.title = builder.title;
        this.author = builder.author;
        this.category = builder.category;
        this.year = builder.year;
        this.page = builder.page;
        this.size = builder.size;
    }

    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public String getCategory() {
        return category;
    }

    public Integer getYear() {
        return year;
    }

    public Integer getPage() {
        return page;
    }

    public Integer getSize() {
        return size;
    }

    public static class Builder {
        private Integer id;
        private String title;
        private String author;
        private String category;
        private Integer year;
        private Integer page;
        private Integer size;

        public Builder setId(Integer id) {
            this.id = id;
            return this;
        }

        public Builder setTitle(String title) {
            this.title = title;
            return this;
        }

        public Builder setAuthor(String author) {
            this.author = author;
            return this;
        }

        public Builder setCategory(String category) {
            this.category = category;
            return this;
        }

        public Builder setYear(Integer year) {
            this.year = year;
            return this;
        }

        public Builder setPage(Integer page) {
            this.page = page;
            return this;
        }

        public Builder setSize(Integer size) {
            this.size = size;
            return this;
        }

        public BookSearchBuilder build() {
            return new BookSearchBuilder(this);
        }
    }
}
