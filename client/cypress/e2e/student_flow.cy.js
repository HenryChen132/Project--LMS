// client/cypress/e2e/student_flow.cy.js
describe("Student E2E flow", () => {
  it("logs in, joins a course and submits an assignment", () => {
    cy.visit("/");

    cy.contains("Login").click();


cy.url().should("include", "/login");
cy.contains("Sign In");


cy.get("input").eq(0).type("henry@hotmail.com"); 
cy.get("input").eq(1).type("123456");                  

cy.contains("button", "Sign In").click();


    
    cy.contains("My Courses");

  
    cy.contains("Math").click();



    cy.contains("View Assignments").click();

 
    cy.contains("Submit").click();

 
    cy.get("textarea").type("This is a Cypress E2E test submission.");

    cy.contains("button", "Submit").click();

    cy.contains("Submitted successfully"); 
    
  });
});
