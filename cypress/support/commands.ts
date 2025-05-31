/// <reference types="cypress" />

Cypress.Commands.add("visitHome", () => {
  cy.visit("/");
});

Cypress.Commands.add("playClassicMode", () => {
  cy.get("[data-id='button-mode-1']").click();
  cy.get("[data-id='button-type-1']").click();
  cy.get("[data-id='button-kanaType-1']").click();
  cy.get("[data-id='button-start']").click();
  cy.get("[data-id='game-mode']").should(
    "contain",
    "Classic & Hiragana & Main"
  );
});

Cypress.Commands.add("playNoErrorsMode", () => {
  cy.get("[data-id='button-mode-2']").click();
  cy.get("[data-id='button-type-2']").click();
  cy.get("[data-id='button-kanaType-2']").click();
  cy.get("[data-id='button-start']").click();
  cy.get("[data-id='game-mode']").should(
    "contain",
    "No errors & Katakana & Dakuten"
  );
});

Cypress.Commands.add("playWithTimeMode", () => {
cy.get("[data-id='button-mode-3']").click();
    cy.get("[data-id='button-type-3']").click();
    cy.get("[data-id='button-kanaType-3']").click();
    cy.get("[data-id='button-start']").click();
    cy.get("[data-id='game-mode']").should(
      "contain",
      "With time (5min) & All syllabaries & Combinations"
    );
});
