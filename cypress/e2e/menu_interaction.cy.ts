describe("menu interaction", () => {
  beforeEach(() => {
    cy.visitHome();
    cy.window().then((win) => {
      (win as Window).CYPRESS_TEST = true;
    });
  });

  it("1", () => {
    cy.playClassicMode();
  });

  it("2", () => {
    cy.playNoErrorsMode();
  });

  it("3", () => {
    cy.playWithTimeMode();
  });
});
