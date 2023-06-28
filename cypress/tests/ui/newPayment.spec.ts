describe('Send new payment', () => {
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

    it('can send new payment', () => {
        cy.get('[data-test="nav-top-new-transaction"]').click();
        cy.url().should('include', '/transaction/new');

        const amount = '1200';
        const formatedAmount = '1,200.00' // needed for test because of in-app formating, comma after thousands and two decimal
        const description = 'Lorem ipsum';

        cy.get('[data-test="users-list"]').find('li').eq(0).click();
        cy.get('[data-test="transaction-create-amount-input"] > div > input').clear().type(amount);
        cy.get('[data-test="transaction-create-description-input"]').clear().type(description);
        cy.intercept('POST', '/transactions').as('sendPayment');
        cy.get('[data-test="transaction-create-submit-payment"]').click();
        cy.wait('@sendPayment').then((res) => {
            const statusCode = res.response?.statusCode;
            expect(statusCode).equal(200);
        });
        cy.get('[data-test="sidenav-user-balance"]').contains('481.37');
        cy.get('[data-test="confirmation-text"]').contains(`Paid $${formatedAmount} for ${description}`);
    });

    it('can request new payment', () => {
        cy.get('[data-test="nav-top-new-transaction"]').click();
        cy.url().should('include', '/transaction/new');

        const amount = '150';
        const formatedAmount = '150.00'; // needed for test because of in-app formating, comma after thousands and two decimal
        const description = 'Lorem ipsum';

        cy.get('[data-test="users-list"]').find('li').eq(0).click();
        cy.get('[data-test="transaction-create-amount-input"] > div > input').clear().type(amount);
        cy.get('[data-test="transaction-create-description-input"]').clear().type(description);
        cy.intercept('POST', '/transactions').as('sendPayment');
        cy.get('[data-test="transaction-create-submit-request"]').click();
        cy.wait('@sendPayment').then((res) => {
            const statusCode = res.response?.statusCode;
            expect(statusCode).equal(200);
        });
        cy.get('[data-test="confirmation-text"]').contains(`Requested $${formatedAmount} for ${description}`);
    });
})