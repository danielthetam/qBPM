package com.daniel.qbpm.requests;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByOrderByDateAsc();
    List<Request> findByOrderByDateDesc();
    List<Request> findByApproved(boolean approved);
    List<Request> findByRequester(String requester);
    List<Request> findByRejected(boolean rejected);
    List<Request> findByRejectedAndApproved(boolean rejected, boolean approved);
    List<Request> findAllByOrderByIdDesc();
}
