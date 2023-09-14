package com.daniel.qbpm.employee;

import javax.persistence.*;

@Entity
@Table(name="Employees")
public class Employee {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long id;

    @Column(name="name")
    private String name;

    @Column(name="eid")
    private long eid;

    @Column(name="password")
    private String password;

    @Column(name="email")
    private String email;

    @Column(name="role")
    private String role;

    @Column(name="department")
    private String[] department;

    @Column(name="datejoined")
    private Integer datejoined;

    @Column(name="photo")
    @Lob
    private byte[] photo;

    @Column(name="admin")
    private boolean admin;

    @Column(name="salt")
    private String salt;

    public Employee(String name, long eid, String password, String email, String role, String[] department, Integer datejoined, byte[] photo, boolean admin, String salt) {
        this.name = name;
        this.eid = eid;
        this.password = password;
        this.email = email;
        this.role = role;
        this.department = department;
        this.datejoined = datejoined;
        this.photo = photo;
        this.admin = admin;
        this.salt = salt;
    }

    public Employee() {

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getEid() {
        return eid;
    }

    public void setEid(long eid) {
        this.eid = eid;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String[] getDepartment() {
        return department;
    }

    public void setDepartment(String[] department) {
        this.department = department;
    }

    public Integer getDatejoined() {
        return datejoined;
    }

    public void setDatejoined(Integer datejoined) {
        this.datejoined = datejoined;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }
}