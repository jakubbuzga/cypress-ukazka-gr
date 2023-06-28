describe('Add bank account', () => {
    beforeEach(() => {
        cy.task('db:seed');
        cy.visit('/signin');

        const username = 'Katharina_Bernier';
        const password = 's3cret';

        cy.get('[data-test="signin-username"] > div > input').clear().type(username);
        cy.get('[data-test="signin-password"]').clear().type(password);
        cy.intercept('POST', '/login').as('login');
        cy.get('[data-test="signin-submit"]').click();
        cy.wait('@login').then((res) => {
            const statusCode = res.response?.statusCode;
            expect(statusCode).equal(200);
        });
    });

    it('can open bank accounts page', () => {
        cy.get('[data-test="sidenav-bankaccounts"]').click();
        cy.url().should('include', '/bankaccounts');
    });

    it('can add new bank account', () => {
        cy.get('[data-test="sidenav-bankaccounts"]').click();
        cy.url().should('include', '/bankaccounts');

        cy.get('[data-test="bankaccount-new"]').click();
        cy.url().should('include', '/bankaccounts/new');

        const bankName = 'Test bank';
        const routingNumber = '123456789';
        const accountNumber = '987654321';

        cy.get('[data-test="bankaccount-bankName-input"] > div > input').clear().type(bankName);
        cy.get('[data-test="bankaccount-routingNumber-input"]').clear().type(routingNumber);
        cy.get('[data-test="bankaccount-accountNumber-input"]').clear().type(accountNumber);
        cy.intercept('POST', 'graphql').as('addBankAccount');
        cy.get('[data-test="bankaccount-submit"]').click();
        cy.wait('@addBankAccount').then((res) => {
            const statusCode = res.response?.statusCode;
            expect(statusCode).equal(200);
        });
        cy.url().should('include', '/bankaccounts'); //user should be redirected back to accounts list

        cy.get('[data-test="bankaccount-list"]').find('li > div > div > p').contains(bankName);
    });
})
