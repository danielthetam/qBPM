package com.daniel.qbpm.requests;
import javax.persistence.*;

@Entity
@Table(name="Requests")
public class Request {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long id;

    @Column(name="requester")
    private String requester;

    @Column(name="date")
    private int date; // yy/mm/dd so that you can sort based on the largest number there is 

    @Column(columnDefinition="TEXT", name="reason")
    private String reason;

    @Column(name="approved")
    private boolean approved;

    @Column(name="duration")
    private int duration;

    @Column(name="rejected")
    private boolean rejected;

    public Request() {

    }

    public Request(String requester, boolean rejected, int date, String reason, boolean approved, int duration) {
        this.requester = requester;
        this.date = date;
        this.reason = reason;
        this.approved = approved;
        this.rejected = rejected;
        this.duration = duration;
    }

    public long getId() {
        return id;
    }

    public String getRequester() {
        return requester;
    }
    public void setRequester(String requester) {
        this.requester = requester;
    }

    public int getRequestDate() {
        return date;
    }
    public void setRequestDate(int date) {
        this.date = date;
    }

    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }

    public boolean getApproved() {
        return approved;
    }

    public void setApproved(boolean newState) {
        this.approved = newState;
    }

    public boolean getRejected() {
        return rejected;
    }

    public void setRejected(boolean newState) {
        this.rejected = newState;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    @Override
    public String toString() {
        return "Request [" +
                    "id=" + id +
                    ", requester=" + requester +
                    ", date=" + date +
                    ", reason=" + reason +
                    ", state=" + approved +
                    ", duration=" + duration +
                    ", rejected=" + rejected +
                "]";
    }
}