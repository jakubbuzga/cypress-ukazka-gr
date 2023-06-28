describe('Onboarding process', () => {
    beforeEach(() => {
        cy.task('db:seed');
        cy.visit('/signin');
    });

    it('can complete onboarding process', () => {
        const firstname = 'Jakub';
        const lastname = 'Buzga';
        const username = 'Jakub_Jakub';
        const password = 'jakub123';
        const bankName = 'Test bank';
        const routingNumber = '123456789';
        const accountNumber = '987654321';
        
        cy.get('[data-test="signup"]').click();
        cy.url().should('include', 'signup');

        // create new account
        cy.get('[data-test="signup-first-name"] > div > input').clear().type(firstname);
        cy.get('[data-test="signup-last-name"]').clear().type(lastname);
        cy.get('[data-test="signup-username"]').clear().type(username);
        cy.get('[data-test="signup-password"]').clear().type(password);
        cy.get('[data-test="signup-confirmPassword"]').clear().type(password);
        cy.get('[data-test="signup-submit"]').click();
        cy.url().should('include', 'signin'); //user should be redirected to login page after successful registration

        // log into the new account
        cy.get('[data-test="signin-username"] > div > input').clear().type(username);
        cy.get('[data-test="signin-password"]').clear().type(password);
        cy.intercept('POST', '/login').as('login');
        cy.get('[data-test="signin-submit"]').click();
        cy.wait('@login').then((res) => {
            const statusCode = res.response?.statusCode;
            expect(statusCode).equal(200);
        });

        // onboarding process
        cy.get('[data-test="user-onboarding-dialog-content"]').should('be.visible');
        cy.get('[data-test="user-onboarding-next"]').click();

        cy.get('[data-test="user-onboarding-dialog-content"]').should('be.visible');
        cy.get('[data-test="bankaccount-bankName-input"]').clear().type(bankName);
        cy.get('[data-test="bankaccount-routingNumber-input"]').clear().type(routingNumber);
        cy.get('[data-test="bankaccount-accountNumber-input"]').clear().type(accountNumber);
        cy.intercept('POST', '/graphql').as('addBankAccount');
        cy.get('[data-test="bankaccount-submit"]').click();
        cy.wait('@addBankAccount').then((res) => {
            const statusCode = res.response?.statusCode;
            expect(statusCode).equal(200);
        });

        cy.get('[data-test="user-onboarding-dialog-content"]').should('be.visible');
        cy.get('[data-test="user-onboarding-next"]').click();
        cy.get('[data-test="main"]').should('be.visible');
    });
})
