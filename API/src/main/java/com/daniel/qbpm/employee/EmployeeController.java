package com.daniel.qbpm.employee;

import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.MessageDigest;
import java.security.SecureRandom;

import java.util.*;

import com.thoughtworks.xstream.core.util.Base64Encoder;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpMethod;

import org.springframework.web.bind.annotation.*;

import javax.xml.bind.DatatypeConverter;

import com.daniel.qbpm.qBPMApplication;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins="http://localhost:3000/")
@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    EmployeeRepository employeeRepository;
    Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    /**
     *<h3>
     *     Generates Random Password
     * @param maxSize
     * @return String password
     */
    private String generatePassword(int maxSize) {
        Random random = new Random();
        char[] alphabets = "abcdefghijklmnopqrstuvwxyz".toCharArray();

        StringBuilder password = new StringBuilder();

        int size = 0;

        // randomising alpha(whether this time it is alphabet or number)
        boolean alpha;
        alpha = random.nextInt() % 2 == 0;

        while (size < maxSize) {
            int times = random.nextInt(2) + 1; // how many times a character(either alpha or number), should be placed
            if ((maxSize - size) < 3) { // to ensure a fixed string size
                times = 1;
            }
            size += times;

            for (int i=0; i<times; i++) {
                if (alpha) {
                    password.append(alphabets[random.nextInt(26)]);
                } else {
                    password.append(random.nextInt(10));
                }
            }
            alpha = !alpha;
        }
        return password.toString();
    }

    @GetMapping("/employees")
    public ResponseEntity<Object> getEmployees(@RequestParam(required=false) Long employeeEid) {
        if (employeeEid == null) {
            List<Employee> employees = new ArrayList<Employee>(employeeRepository.findAll());
            List<Map<String, Object>> _employees = new ArrayList<Map<String, Object>>();
            for (Employee employee : employees) {
                try {
                    // Encoding photo bytea
                    String imageData = DatatypeConverter.printBase64Binary(employee.getPhoto());

                    Map<String, Object> employeeBody = new HashMap<>();
                    employeeBody.put("name", employee.getName());
                    employeeBody.put("eid", employee.getEid());
                    employeeBody.put("email", employee.getEmail());
                    employeeBody.put("role", employee.getRole());
                    employeeBody.put("department", employee.getDepartment());
                    employeeBody.put("datejoined", employee.getDatejoined());
                    employeeBody.put("isAdmin", employee.isAdmin());
                    employeeBody.put("photo", imageData);

                    _employees.add(employeeBody);
                    return new ResponseEntity<>(_employees, HttpStatus.OK);
                } catch (Exception e) {
                    logger.error(e.toString());
                }
            }
        } else {
            Employee employee = employeeRepository.findByEid(employeeEid);
            String imageData = DatatypeConverter.printBase64Binary(employee.getPhoto());

            Map<String, Object> employeeBody = new HashMap<>();
            employeeBody.put("name", employee.getName());
            employeeBody.put("eid", employee.getEid());
            employeeBody.put("email", employee.getEmail());
            employeeBody.put("role", employee.getRole());
            employeeBody.put("department", employee.getDepartment());
            employeeBody.put("datejoined", employee.getDatejoined());
            employeeBody.put("photo", imageData);
            employeeBody.put("isAdmin", employee.isAdmin());
            return new ResponseEntity<>(employeeBody, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * <h3>
     * Generates eID and password
     * <p>
     * Body: name, email, role, List department, Integer datejoined, Boolean admin, photo
     */
    @PostMapping("/employees")
    public ResponseEntity<Map<String, Object>> createEmployee(@RequestBody Map<String, Object> employee) {
        try {
            long latestEid = 0;
            // Build on the most recent employee id(prevent collisions)
            try {
                latestEid = employeeRepository.findAllByOrderByEidDesc().get(0).getEid(); // get largest eid so far
            } catch (IndexOutOfBoundsException e) {
                logger.info("No records found, starting from 0.");
            }

            long newEid;
            if (latestEid < 100000000 && latestEid != 99999999) {
                newEid = latestEid + 100000001;
            } else {
                newEid = latestEid + 1;
            } // incrementing latest eid by 1 to create new eid

            // decoding photo base64 into bytea to store
            Base64Encoder encoder = new Base64Encoder();
            byte[] byteData = encoder.decode((String)employee.get("photo"));

            // Generating Salt
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[32];
            random.nextBytes(salt);
            String bSalt = encoder.encode(salt);

            // Salting and Hashing
            String genPassword = generatePassword(10);
            String password = genPassword + bSalt;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String hashedPassword = encoder.encode(digest.digest(password.getBytes(StandardCharsets.UTF_8))); // encoding the digest

            // Conversion of department and roles array types for suitable use
            List<Object> departmentListObjs = (ArrayList<Object>) employee.get("department"); // json array comes as arraylist of objects, so we convert it
            List<String> departmentList = new ArrayList<String>(); // api body parameter only accepts
            String[] departmentStringArray = new String[departmentListObjs.size()]; // to save employee field as array
            for (int i=0; i<departmentListObjs.size(); i++) {
                String obj = departmentListObjs.get(i).toString();
                departmentList.add(obj);
                departmentStringArray[i] = obj;
            }

            // Save obj to database
            employeeRepository.save(new Employee(
                    (String) employee.get("name"),
                    newEid,
                    hashedPassword,
                    (String) employee.get("email"),
                    (String) employee.get("role"),
                    departmentStringArray,
                    (int)employee.get("datejoined"),
                    byteData,
                    (boolean) employee.get("admin"),
                    bSalt
            ));

            // Instantiating RestTemplate and headers
            RestTemplate restTemplate = new RestTemplate();

            String authorization = "Basic " + encoder.encode((qBPMApplication.ADMIN_USER + ":" + qBPMApplication.ADMIN_PASSWORD).getBytes(StandardCharsets.UTF_8));

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authorization);
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "application/json");

            // Sending post request to create jBPM user
            String URL = qBPMApplication.BASE_BC_URI + "/users";

            Map<String, String> body = new HashMap<String, String>();
            body.put("name", String.valueOf(newEid));
            HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> result = restTemplate.exchange(URL, HttpMethod.POST, httpEntity, String.class);

            logger.info(result.toString());

            // Setting password to generated password
            URL = qBPMApplication.BASE_BC_URI + "/users/" + newEid + "/changePassword";

            HttpEntity<String> pHttpEntity = new HttpEntity<>(genPassword, headers);
            result = restTemplate.exchange(URL, HttpMethod.POST, pHttpEntity, String.class);
            logger.info(result.toString());

            // Assigning user role
            URL = qBPMApplication.BASE_BC_URI + "/users/" + newEid + "/roles";
            List<String> roleBody = new ArrayList<String>();
            roleBody.add("user");

            // if employee is admin, assign admin
            if ((boolean) employee.get("admin")) {
                roleBody.add("admin");
            }

            HttpEntity<List<String>> roleHttpEntity = new HttpEntity<>(roleBody, headers);
            result = restTemplate.exchange(URL, HttpMethod.POST, roleHttpEntity, String.class);
            logger.info(result.toString());

            // Assigning groups
            URL = qBPMApplication.BASE_BC_URI + "/users/" + newEid + "/groups";

            HttpEntity<List<String>> groupHttpEntity = new HttpEntity<>(departmentList, headers);
            result = restTemplate.exchange(URL, HttpMethod.POST, groupHttpEntity, String.class);
            logger.info(result.toString());

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("eid", newEid);
            responseBody.put("password", genPassword);

            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.toString());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.toString());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Returns a boolean dictating whether eid exists and the password matches it.
     * <p>
     * Parses the values, queries the database for @Employee object with the matching eid
     * and gets the salt and hashed-and-salted password from the database,
     * hashes and salts the given password, and checks whether they are a match
     * <p>
     * Body: Map containing {@code eid, password}
     */
    @PostMapping("/login")
    public ResponseEntity<Boolean> loginTest(@RequestBody Map<String, String> body) {
        try {
            String password = body.get("password");
            long eid = Integer.parseInt(body.get("eid"));

            List<Employee> employees = employeeRepository.findAll();
            String salt = "";
            String ePassword = "";
            boolean employeeFound = false;
            for (Employee employee : employees) {
                if (Objects.equals(employee.getEid(), eid)) {
                    salt = employee.getSalt();
                    ePassword = employee.getPassword();
                    employeeFound = true;
                }
            }
            if (!employeeFound) {
                return new ResponseEntity<>(false, HttpStatus.OK);
            }
            Base64Encoder encoder = new Base64Encoder();
            password += salt;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String hashedPassword = encoder.encode(digest.digest(password.getBytes(StandardCharsets.UTF_8))); // encoding the digest
            if (Objects.equals(hashedPassword, ePassword)) {
                return new ResponseEntity<>(true, HttpStatus.OK);
            }
            return new ResponseEntity<>(false, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.toString());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}