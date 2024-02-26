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
    cy.wait(500);
  });

  it('Press random card, it gets opened', () => {
    const icard = Math.floor(Math.random() * 16);
    cy.get('.card').eq(icard).click();
    cy.get('.card').eq(icard)
      .should('have.attr', 'style').should('contain', 'transform: rotateX(180deg)');
    cy.wait(500);
  });

  it('Find the match for the left top card, the pair have to stay opened', () => {
    cy.get('.back').then(($els) => {
      const nums = Array.from($els, (el) => el.innerText);

      for (let i = 1; i < 16; i++) {
        cy.clock();
        cy.get('.card').eq(0).click();
        cy.get('.card').eq(i).click().click()
          .click()
          .click()
          .click()
          .click();
        cy.tick(1200);
        cy.wait(500);

        if (nums[0] === nums[i]) {
          cy.get('.card').eq(0)
            .should('have.attr', 'style').should('contain', 'transform: rotateX(180deg)');
          cy.get('.card').eq(i)
            .should('have.attr', 'style').should('contain', 'transform: rotateX(180deg)');
          break;
        }
      }
    });
  });

  it('If not match, both cards get closed after 1200мс', () => {
    cy.get('.back').then(($els) => {
      const nums = Array.from($els, (el) => el.innerText);
      let j = 0;
      for (let i = 1; i < 16; i++) {
        cy.clock();
        cy.get('.card').eq(j).click();
        cy.wait(300);
        cy.get('.card').eq(i).click().click()
          .click()
          .click()
          .click()
          .click();
        cy.tick(1200);
        cy.wait(500);

        if (nums[j] !== nums[i]) {
          cy.get('.card').eq(j)
            .should('have.attr', 'style').should('contain', 'transform: rotateX(0deg)');
          cy.get('.card').eq(i)
            .should('have.attr', 'style').should('contain', 'transform: rotateX(0deg)');
          break;
        } else { j += 2; i++; }
      }
    });
  });
});
