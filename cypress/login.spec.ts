describe('Login into application', () => {
    beforeEach(() => {
        cy.task('db:seed');
        cy.visit('/signin');
    });

    const username = 'Katharina_Bernier';
    const password = 's3cret';
    const passwordInvalid = 'invalid1';

    it('can login with valid credentials - success', () => {
        cy.get('[data-test="signin-username"] > div > input').clear().type(username);
        cy.get('[data-test="signin-password"]').clear().type(password);
        cy.intercept('POST', '/login').as('login');
        cy.get('[data-test="signin-submit"]').click();
        cy.wait('@login').then((res) => {
            const statusCode = res.response?.statusCode;
            expect(statusCode).equal(200);
        });
        cy.get('[data-test="main"]').should('be.visible');
    });

    it('cannot login with invalid credentials - fail', () => {
        cy.get('[data-test="signin-username"] > div > input').clear().type(username);
        cy.get('[data-test="signin-password"]').clear().type(passwordInvalid);
        cy.intercept('POST', '/login').as('login');
        cy.get('[data-test="signin-submit"]').click();
        cy.wait('@login').then((res) => {
            const statusCode = res.response?.statusCode;
            expect(statusCode).equal(401);
        });
    });

    it('can logout of application', () => {
        cy.get('[data-test="signin-username"] > div > input').clear().type(username);
        cy.get('[data-test="signin-password"]').clear().type(password);
        cy.intercept('POST', '/login').as('login');
        cy.get('[data-test="signin-submit"]').click();
        cy.wait('@login').then((res) => {
            const statusCode = res.response?.statusCode;
            expect(statusCode).equal(200);
        });
        cy.get('[data-test="sidenav-signout"]').click();
        cy.url().should('include', 'signin');
    });
})
