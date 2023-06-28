describe('Register new user', () => {
    beforeEach(() => {
        cy.task('db:seed');
        cy.visit('/signin');
    })

    it('create new unique user - success', () => {
        const firstname = 'Jakub';
        const lastname = 'Buzga';
        const username = 'Jakub_Jakub';
        const password = 'jakub123';

        cy.get('[data-test="signup"]').click();
        cy.url().should('include', 'signup');

        cy.get('[data-test="signup-first-name"] > div > input').clear().type(firstname);
        cy.get('[data-test="signup-last-name"]').clear().type(lastname);
        cy.get('[data-test="signup-username"]').clear().type(username);
        cy.get('[data-test="signup-password"]').clear().type(password);
        cy.get('[data-test="signup-confirmPassword"]').clear().type(password);
        cy.get('[data-test="signup-submit"]').click();
        cy.url().should('include', 'signin'); //user should be redirected to login page after successful registration

        //verify that user was created
        cy.get('[data-test="signin-username"] > div > input').clear().type(username);
        cy.get('[data-test="signin-password"]').clear().type(password);
        cy.intercept('POST', '/login').as('login');
        cy.get('[data-test="signin-submit"]').click();
        cy.wait('@login').then((res) => {
            const statusCode = res.response?.statusCode;
            expect(statusCode).equal(200);
        });
    });

    it('can return to login page', () => {
        cy.get('[data-test="signup"]').click();
        cy.url().should('include', 'signup');
        cy.get('[data-test="back-to-signin-link"]').click();
        cy.url().should('include', 'signin');
    });
})
