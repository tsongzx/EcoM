// Ensures user is able to register then logout then login
describe("Happy path", () => {
  let randomString;
  let email;
  

  before(() => {
    randomString = Math.random().toString(36).substring(2, 10);
    email = `test_${randomString}@example.com`;
    Cypress.env('randomString', randomString);
    Cypress.env('email', email);
  });

  beforeEach(() => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000');
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
    cy.contains('Email').next().find('input').type(email); 
    cy.contains('Password').next().find('input').type('qwerty123');
    cy.contains('Confirm Password').next().find('input').type('qwerty123');
    cy.get('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary')
      .contains('Register')
      .click();

    cy.url().should('include', 'localhost:3000/Dashboard');
    cy.contains('a', 'Logout').should('exist').click();
    cy.contains('button', 'Login').should('exist').click({ force: true });

    cy.get('.MuiDialogContent-root')
      .should('exist')
      .and('contain.text', 'Email');
    cy.contains('Email').next().find('input').type(email); 
    cy.contains('Password').next().find('input').type('qwerty123');
    cy.get('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary')
      .contains('Login')
      .click();

    cy.url().should('include', 'localhost:3000/Dashboard');
  });
});

// Ensures that user is able to access the dashboard components
describe("Dashboard components present", () => {


  beforeEach(() => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000');
    cy.contains('button', 'Login').should('exist').click({ force: true });
    cy.contains('Email').next().find('input').type(Cypress.env('email')); 
    cy.contains('Password').next().find('input').type('qwerty123');
    cy.get('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary')
      .contains('Login')
      .click();
    
    cy.url().should('include', 'localhost:3000/Dashboard');
  });

  it('Should show navbar', () => {
    cy.contains('a', 'Logout').should('exist');
    cy.contains('a', 'Home').should('exist');
    cy.contains('a', 'Profile').should('exist');
  });

  it('Should show dropdown for industry, framework and company', () => {
    cy.contains('Industry').should('exist');
    cy.contains('Framework').should('exist');
    cy.contains('Company').should('exist');
    cy.contains('Go').should('exist');
  });

  it('Should have a section for recently viewed, favorites and list', () => {
    cy.contains('Recently Viewed').should('exist');
    cy.contains('Favourites').should('exist');
    cy.contains('My Lists').should('exist');
    cy.get('.css-1fdsijx-ValueContainer').should('exist');
  });

  it('Should have Chatbot', () => {
    cy.contains('Talk to me!').should('exist');
  });
});

// Ensures that user is able to search + view the company page fine
describe("Company components present", () => {


  beforeEach(() => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000');
    cy.contains('button', 'Login').should('exist').click({ force: true });
    cy.contains('Email').next().find('input').type(Cypress.env('email')); 
    cy.contains('Password').next().find('input').type('qwerty123');
    cy.get('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary')
      .contains('Login')
      .click();
    
    cy.url().should('include', 'localhost:3000/Dashboard');
  });

  it('Should allow dropdown', () => {
    cy.contains('Company').click({ force: true });
    cy.contains('Alx Resources Corp').should('exist');
    cy.visit('http://localhost:3000/company/1');
    
  });

});



