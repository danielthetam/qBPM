package com.daniel.qbpm;

import org.kie.api.KieBaseConfiguration;
import org.kie.server.api.KieServerConstants;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.myspace.wfhrequest_portal.Request;
import com.myspace.wfhrequest_portal.Employee;

import org.kie.server.client.KieServicesClient;
import org.kie.server.client.KieServicesConfiguration;
import org.kie.server.client.KieServicesFactory;
import org.kie.server.client.ProcessServicesClient;
import org.kie.server.api.marshalling.MarshallingFormat;
import org.kie.server.client.credentials.EnteredCredentialsProvider;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@SpringBootApplication
public class qBPMApplication {
    public static final String BASE_URI = "http://localhost:8080";
    public static final String BASE_BC_URI = BASE_URI + "/business-central/rest";
    public static final String BASE_KIE_URI = BASE_URI + "/kie-server/services/rest/server";
    public static final String ADMIN_USER = "wbadmin";
    public static final String ADMIN_PASSWORD = "wbadmin";

    public static final MarshallingFormat FORMAT = MarshallingFormat.JSON;

    public static KieServicesConfiguration conf;
    public static KieServicesClient kieServicesClient;
    public static ProcessServicesClient processService;

    public static void initialize() {
        // Establishing REST Connection
        conf = KieServicesFactory.newRestConfiguration(BASE_KIE_URI, new EnteredCredentialsProvider(ADMIN_USER, ADMIN_PASSWORD));

        // Adding data objects to config
        Set<Class<?>> extraClassList = new HashSet<>();
        extraClassList.add(Employee.class);
        extraClassList.add(Request.class);
        conf.addExtraClasses(extraClassList);

        // Configuration
        conf.setMarshallingFormat(FORMAT);
        kieServicesClient = KieServicesFactory.newKieServicesClient(conf);

        // Starting service
        processService = kieServicesClient.getServicesClient(ProcessServicesClient.class);
    }

    public static Long createWFHProcess(Map<String, Object> formData) {
        System.out.println(formData);
        return processService.startProcess(
                "WFHRequest-Portal_1.0.0-SNAPSHOT",
                "WFHRequest-Portal.request-portal",
                formData
        );
    }

    public static void main(String[] args) {
        initialize();
        SpringApplication.run(qBPMApplication.class, args);
    }
}
