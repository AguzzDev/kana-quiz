describe("menu interaction", () => {
  beforeEach(() => {
    cy.visitHome();
    cy.window().then((win) => {
      (win as Window).CYPRESS_TEST = true;
    });
  });

  it("should return 'Select syllabary and group' error", () => {
    cy.get("[data-id='button-start']").click();
    cy.get("[data-id='error']").should("contain", "Select syllabary and group");
  });

  it("should return 'Select a syllabary' error", () => {
    cy.get("[data-id='button-kanaType-1']").click();
    cy.get("[data-id='button-start']").click();
    cy.get("[data-id='error']").should("contain", "Select a syllabary");
  });

  it("should return 'Select a group' error", () => {
    cy.get("[data-id='button-type-1']").click();
    cy.get("[data-id='button-start']").click();
    cy.get("[data-id='error']").should("contain", "Select a group");
  });

  it("should create a game in classic mode", () => {
    cy.playClassicMode();
  });

  it("should create a game in no errors mode", () => {
    cy.playNoErrorsMode();
  });

  it("should create a game in with time mode", () => {
    cy.playWithTimeMode();
  });

  it("should create a game in no errors with time mode", () => {
    cy.playNoErrorsWithTimeMode();
  });
});
