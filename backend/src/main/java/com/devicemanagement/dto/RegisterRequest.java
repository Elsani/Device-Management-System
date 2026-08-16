package com.devicemanagement.dto;

import com.devicemanagement.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Emri i plotë është i detyrueshëm")
    private String fullName;

    @NotBlank(message = "Email është i detyrueshëm")
    @Email(message = "Formati i emailit nuk është i saktë")
    private String email;

    @NotBlank(message = "Fjalëkalimi është i detyrueshëm")
    @Size(min = 6, message = "Fjalëkalimi duhet të ketë të paktën 6 karaktere")
    private String password;

    @NotNull(message = "Roli është i detyrueshëm (ADMIN ose EMPLOYEE)")
    private Role role;

    public RegisterRequest() {}

    public RegisterRequest(String fullName, String email, String password, Role role) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
