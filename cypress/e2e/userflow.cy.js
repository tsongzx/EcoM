describe("happy path", () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000');
    
    // Open the Register modal if necessary
    cy.contains('button', 'Register').click({ force: true });
  });

  it('Should have the Register button visible', () => {
    cy.contains('button', 'Register').should('exist'); 
  });

  it('Should open the Register modal and show Name field', () => {
    cy.get('.MuiDialogContent-root')
      .should('exist')
      .and('contain.text', 'Name');
  });

  it('should register and logout successfully given the correct details', () => {
    cy.get('.MuiDialogContent-root').should('exist');
    cy.contains('Name').next().find('input').type('Anonymous');
    cy.contains('Email').next().find('input').type('testing12345678@gmail.com');
    cy.contains('Password').next().find('input').type('qwerty123');
    cy.contains('Confirm Password').next().find('input').type('qwerty123');
    cy.get('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary')
      .contains('Register')
      .click();

    cy.url().should('include', 'localhost:3000/Dashboard');
    cy.contains('a', 'Logout').should('exist').click();
    cy.contains('button', 'Login').should('exist'); 
    cy.contains('button', 'Login').click({ force: true });
    cy.get('.MuiDialogContent-root')
    .should('exist')
    .and('contain.text', 'Email');
    cy.contains('Email').next().find('input').type('testing12345678@gmail.com');
    cy.contains('Password').next().find('input').type('qwerty123');
    cy.get('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary')
    .contains('Login')
    .click();

    cy.url().should('include', 'localhost:3000/Dashboard');







  });


});
