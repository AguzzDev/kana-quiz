describe("live", () => {
  it("visit home", () => {
    cy.visitHome();
    cy.get("h1").should("contain", "Kana Quiz")
  });
});
