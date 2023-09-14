package com.daniel.qbpm.jbpmrp;


import com.daniel.qbpm.qBPMApplication;
import com.daniel.qbpm.requests.Request;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.thoughtworks.xstream.core.util.Base64Encoder;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.*;

@CrossOrigin(origins="http://localhost:3000/")
@RestController
@RequestMapping("/proxy")
public class JBPMRequestProxy {
    @GetMapping("/groups")
    public ResponseEntity<List<String>> getDepartmentList() {
        // Instantiating RestTemplate and headers
        RestTemplate restTemplate = new RestTemplate();
        Base64Encoder encoder = new Base64Encoder();

        String authorization = "Basic " + encoder.encode((qBPMApplication.ADMIN_USER + ":" + qBPMApplication.ADMIN_PASSWORD).getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authorization);
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");

        String URL = qBPMApplication.BASE_BC_URI + "/groups";

        HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(headers);
        ResponseEntity<ArrayList> result = restTemplate.exchange(URL, HttpMethod.GET, httpEntity, ArrayList.class);

        List<String> groupList = new ArrayList<>();
        for (LinkedHashMap<String, String> group : (ArrayList<LinkedHashMap>) result.getBody()) {
            groupList.add(group.get("name"));
        }

        return new ResponseEntity<>(groupList, HttpStatus.OK);
    }

    @GetMapping("/tasks")
    public ResponseEntity<Object> getTasks(@RequestParam long eid) {
        try {
            String URL = qBPMApplication.BASE_KIE_URI + "/queries/tasks/instances/pot-owners";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            Base64Encoder encoder = new Base64Encoder();
            String parameters = "?status=Ready&status=Reserved&status=InProgress" +
                    "&user=" + eid + "&" +
                    "page=0&" +
                    "pageSize=0&" +
                    "sortOrder=true";

            String authorization = "Basic " + encoder.encode((qBPMApplication.ADMIN_USER + ":" + qBPMApplication.ADMIN_PASSWORD).getBytes(StandardCharsets.UTF_8));
            headers.set("Authorization", authorization);
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "application/json");

            HttpEntity<String> httpEntity = new HttpEntity<>("", headers);
            ResponseEntity<Map> result = restTemplate.exchange(URL + parameters,
                    HttpMethod.GET,
                    httpEntity,
                    Map.class
            );
            return new ResponseEntity<>(result.getBody(), HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/tasks/input")
    public ResponseEntity<Object> getTaskInput(@RequestParam long taskInstanceId, String containerId) {
        try {
            String URL = qBPMApplication.BASE_KIE_URI + "/containers/" +
                    containerId +
                    "/tasks/" +
                    taskInstanceId +
                    "/contents/input";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            Base64Encoder encoder = new Base64Encoder();

            String authorization = "Basic " + encoder.encode((qBPMApplication.ADMIN_USER + ":" + qBPMApplication.ADMIN_PASSWORD).getBytes(StandardCharsets.UTF_8));
            headers.set("Authorization", authorization);
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "application/json");

            HttpEntity<String> httpEntity = new HttpEntity<>("", headers);
            ResponseEntity<Map> result = restTemplate.exchange(
                    URL,
                    HttpMethod.GET,
                    httpEntity,
                    Map.class
            );
            return new ResponseEntity<>(result.getBody(), HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/tasks/output")
    public ResponseEntity<Object> getTaskOutput(@RequestParam long taskInstanceId, String containerId, @RequestBody Map<String, Object> body) {
        try {
            String URL = qBPMApplication.BASE_KIE_URI + "/containers/" +
                    containerId +
                    "/tasks/" +
                    taskInstanceId +
                    "/states/completed?auto-progress=true";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            Base64Encoder encoder = new Base64Encoder();

            String authorization = "Basic " + encoder.encode((qBPMApplication.ADMIN_USER + ":" + qBPMApplication.ADMIN_PASSWORD).getBytes(StandardCharsets.UTF_8));
            headers.set("Authorization", authorization);
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "application/json");

            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> result = restTemplate.exchange(
                    URL,
                    HttpMethod.PUT,
                    httpEntity,
                    String.class
            );
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
