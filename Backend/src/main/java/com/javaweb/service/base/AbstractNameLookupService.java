package com.javaweb.service.base;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public abstract class AbstractNameLookupService<E, R> {

    public final List<R> searchByName(String name) {
        List<E> entities = (name == null || name.isBlank())
                ? findAll()
                : findByName(name);
        return entities.stream()
                .filter(Objects::nonNull)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    protected abstract List<E> findAll();

    protected abstract List<E> findByName(String name);

    protected abstract R toResponse(E entity);
}
