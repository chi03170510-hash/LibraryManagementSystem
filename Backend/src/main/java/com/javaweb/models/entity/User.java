package com.javaweb.models.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.javaweb.enums.Role;
import com.javaweb.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fullName")
    private String fullName;

    @Column(name = "user_name", nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "password", length = 200, nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "address", length = 250)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus status;

    @JsonManagedReference
    @OneToMany(mappedBy = "reader", fetch = FetchType.LAZY)
    private List<BorrowTransaction> borrowTransactionsOfReader = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "staff", fetch = FetchType.LAZY)
    private List<BorrowTransaction> borrowTransactionsOfStaff = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private List<Notification> notificationsOfStaff = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "recipient", fetch = FetchType.LAZY)
    private List<Notification> notificationsOfReader = new ArrayList<>();

    public Collection<? extends GrantedAuthority> getAuthorities(){
        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority("ROLE_" + getRole().toString().toUpperCase()));
        return authorityList;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.INACTIVE;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == UserStatus.ACTIVE;
    }

    @JsonManagedReference
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Feedback> reviews = new ArrayList<>();
}
