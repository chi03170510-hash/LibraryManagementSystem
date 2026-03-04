package com.javaweb.config;

import com.javaweb.enums.Role;
import com.javaweb.filters.JwtTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@EnableWebMvc
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final JwtTokenFilter jwtTokenFilter;

    @Bean
    public DefaultSecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(requests -> {
                    requests
                            .requestMatchers("/profile", "/transaction/history", "/public/**")
                            .permitAll()
                            .requestMatchers(GET, "/staff/**").hasAnyRole("STAFF", "ADMIN")
                            .requestMatchers(POST, "/staff/**").hasAnyRole("STAFF", "ADMIN")
                            .requestMatchers(PUT, "/staff/**").hasAnyRole("STAFF", "ADMIN")
                            .requestMatchers(DELETE, "/staff/**").hasAnyRole("STAFF", "ADMIN")
                            .anyRequest().authenticated();

                });
        return http.build();
    }

}
