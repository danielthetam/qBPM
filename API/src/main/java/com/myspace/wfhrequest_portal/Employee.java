package com.myspace.wfhrequest_portal;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class Employee implements java.io.Serializable {

	static final long serialVersionUID = 1L;

	@org.kie.api.definition.type.Label("Employee ID")
	private Long eid;
	@org.kie.api.definition.type.Label("Name")
	private java.lang.String name;
	@org.kie.api.definition.type.Label("Email")
	private java.lang.String email;

	public Employee() {
	}

	public java.lang.String getName() {
		return this.name;
	}

	public void setName(java.lang.String name) {
		this.name = name;
	}

	public java.lang.String getEmail() {
		return this.email;
	}

	public void setEmail(java.lang.String email) {
		this.email = email;
	}

	public java.lang.Long getEid() {
		return this.eid;
	}

	public void setEid(java.lang.Long eid) {
		this.eid = eid;
	}

	public Employee(java.lang.Long eid, java.lang.String name,
			java.lang.String email) {
		this.eid = eid;
		this.name = name;
		this.email = email;
	}

}
