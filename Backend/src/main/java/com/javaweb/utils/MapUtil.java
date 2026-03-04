package com.javaweb.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public class MapUtil {
    public static <T> T getObject(Map<String, Object> request, String key, Class<T> tClass){
        Object obj = request.getOrDefault(key, null);
        if(obj != null){
            if(tClass.getTypeName().equals("java.lang.Long")){
                String value = obj.toString().trim();
                obj = value.isEmpty() ? null : Long.valueOf(value);
            }
            else if(tClass.getTypeName().equals("java.lang.Integer")){
                String value = obj.toString().trim();
                obj = value.isEmpty() ? null : Integer.valueOf(value);
            }
            else if(tClass.getTypeName().equals("java.lang.String")){
                obj = obj.toString();
            }
            else if(tClass.isEnum()){
                obj = Enum.valueOf((Class<Enum>) tClass, obj.toString());
            }
            else if(tClass.getTypeName().equals("java.util.Date")){
                try{
                    obj = new SimpleDateFormat("yyyy-MM-dd").parse(obj.toString());
                } catch (ParseException e){
                    throw new RuntimeException("Invalid date format for key " + key, e);
                }
            }
            else if(tClass.getTypeName().equals("java.time.LocalDate")){
                obj = LocalDate.parse(obj.toString(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }

            return tClass.cast(obj);
        }
        return null;
    }
}


