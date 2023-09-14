package com.daniel.qbpm.employee;

import java.math.BigInteger;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findAllByOrderByIdAsc();
    List<Employee> findAllByOrderByIdDesc();
    List<Employee> findAllByOrderByEidDesc();
    List<Employee> findAllByOrderByDatejoinedAsc();
    List<Employee> findAllByOrderByDatejoinedDesc();
    List<Employee> findAllByOrderByNameAsc();
    List<Employee> findAllByOrderByNameDesc();
    Employee findByEid(Long eid);
}
