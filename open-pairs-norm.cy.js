/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/// <reference types="cypress"/>

describe('Pairs game', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/');
    cy.contains('Start game').click();
  });

  it('There are 16 cards in the beginning and all closed', () => {
    cy.get('.deck').find('label').should('have.length', 16);
    cy.get('.back').each(() => { })
      .should('have.attr', 'style').should('contain', 'transform: rotateX(180deg)');
  });

  it('Press random card, it gets opened', () => {
    const icard = Math.floor(Math.random() * 16);
    cy.get('.card').eq(icard).click();
    cy.get('.card').eq(icard)
      .should('have.attr', 'style').should('contain', 'transform: rotateX(180deg)');
  });

  it.only('Find the match for the left top card, the pair have to stay opened', () => {
    for (let i = 1; i < 16; i++) {
      cy.clock();
      cy.get('.card').eq(0).click();
      cy.get('.card').eq(i).click();
      cy.tick(1200);

      cy.get('.back').eq(0).then((el) => el.text()).then((tc0) => {
        cy.log(`textcontent is ${tc0}`);

        cy.get('.back').eq(i).then((el) => el.text()).then((tci) => {
          cy.log(`textcontent is ${tci}`);
          if (tc0 === tci) {
            cy.get('.card').eq(0)
              .should('have.attr', 'style').should('contain', 'transform: rotateX(180deg)');
            cy.get('.card').eq(i)
              .should('have.attr', 'style').should('contain', 'transform: rotateX(180deg)');
          }
        });
      });
    }
  });
});
