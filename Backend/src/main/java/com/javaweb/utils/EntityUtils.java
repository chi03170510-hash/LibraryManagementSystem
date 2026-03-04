package com.javaweb.utils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class EntityUtils {
    public static List<String> getNullFields(Object obj) {
        List<String> nullFields = new ArrayList<>();
        if (obj == null) return nullFields;

        Field[] fields = obj.getClass().getDeclaredFields();
        for (Field field : fields) {
            if (java.lang.reflect.Modifier.isStatic(field.getModifiers())) continue; // skip static fields
            field.setAccessible(true);
            try {
                Object value = field.get(obj);
                if (value == null) {
                    nullFields.add(field.getName());
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return nullFields;
    }

    public static boolean hasNullField(Object obj) {
        return !getNullFields(obj).isEmpty();
    }

    public static boolean allFieldsNotNullExceptId(Object obj) {
        if (obj == null) return false;

        Field[] fields = obj.getClass().getDeclaredFields();
        boolean idIsNull = false;

        for (Field field : fields) {
            if (java.lang.reflect.Modifier.isStatic(field.getModifiers())) continue;
            field.setAccessible(true);

            try {
                Object value = field.get(obj);

                if (field.getName().equals("id")) {
                    if (value == null) {
                        idIsNull = true;
                    } else {
                        return false;
                    }
                } else {
                    if (value == null) {
                        return false;
                    }
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return idIsNull;
    }

    public static boolean idMustBeNullAndOthersNotNull(Object obj) {
        if (obj == null) return false;

        Field[] fields = obj.getClass().getDeclaredFields();
        for (Field field : fields) {
            if (java.lang.reflect.Modifier.isStatic(field.getModifiers())) continue;
            field.setAccessible(true);

            try {
                Object value = field.get(obj);

                if (field.getName().equals("id")) {
                    if (value != null) {
                        return false;
                    }
                } else {
                    if (value == null) {
                        return false;
                    }
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }


}
