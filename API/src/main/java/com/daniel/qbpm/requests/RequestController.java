package com.daniel.qbpm.requests;

import com.daniel.qbpm.employee.Employee;
import com.daniel.qbpm.employee.EmployeeController;
import com.daniel.qbpm.employee.EmployeeRepository;
import com.daniel.qbpm.qBPMApplication;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins="http://localhost:3000/")
@RestController
@RequestMapping("/api")
public class RequestController {

	@Autowired
	EmployeeRepository employeeRepository;

	Logger logger = LoggerFactory.getLogger(EmployeeController.class);

	@PostMapping("/requests")
	public ResponseEntity<HttpStatus> createRequest(@RequestBody Map<String, Object> requestParameters) {
		try {
			Map<String, Object> requestForm = new HashMap<String, Object>();
			long eid = Long.valueOf((Integer) requestParameters.get("eid"));
			Employee employeeModel = employeeRepository.findByEid(eid);
			com.myspace.wfhrequest_portal.Employee employee = new com.myspace.wfhrequest_portal.Employee();
			employee.setEid(eid);
			employee.setEmail(employeeModel.getEmail());
			employee.setName(String.valueOf(employeeModel.getName()));
			requestForm.put("employee", employee);

			com.myspace.wfhrequest_portal.Request request = new com.myspace.wfhrequest_portal.Request();
			request.setReqDt((int) requestParameters.get("requestDate")); // YY-MM-DD format
			request.setReason((String) requestParameters.get("reason"));
			request.setNumOfDays((int) requestParameters.get("numOfDays"));
			requestForm.put("request", request);
			logger.info("WFH Process Instance Created: " + qBPMApplication.createWFHProcess(requestForm));
			return new ResponseEntity<>(HttpStatus.OK);
		}
		catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
