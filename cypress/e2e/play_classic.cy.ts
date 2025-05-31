import { hiraganaMainKanaData } from "../../src/lib/data";

describe("play classic mode", () => {
  beforeEach(() => {
    cy.visitHome();
    cy.window().then((win) => {
      (win as Window).CYPRESS_TEST = true;
    });
    cy.playClassicMode();
  });

  it("perfect", () => {
    hiraganaMainKanaData.forEach((d) => {
      cy.focused().type(`${d.romaji}{enter}`);
    });
    cy.get("[data-id='overall-correct']").should("contain", "46/46 (100.00%)");
  });

  it("50% errors", () => {
    hiraganaMainKanaData.forEach((_, i: number) => {
      const cond = i % 2 === 0;
      const char = cond ? hiraganaMainKanaData[i].romaji : "asd";

      cy.focused().type(`${char}{enter}`);
    });

    cy.get("button").click();
    cy.get("[data-id='overall-correct']").should("contain", "23/46 (50.00%)");
  });

  it("randomly positions", () => {
    let i = 0;
    let tryTrues = 0;
    const positions = [2, 5, 7, 10];

    const attempt = (): void => {
      if (i === positions.length) {
        return;
      }

      const cond = positions[i] === 2 || positions[i] === 5;
      const pos = positions[i];
      const char = cond ? hiraganaMainKanaData[pos].romaji : "asd";

      cy.get("body").then(($body) => {
        const hasInput = $body.find("input").length > 0;
        if (hasInput) {
          cy.get("input")
            .eq(tryTrues > 0 ? pos - tryTrues : pos)
            .type(`${char}{enter}`)
            .then(() => {
              i++;
              tryTrues++;
              attempt();
            });
        }
      });
    };

    attempt();

    cy.get("button").click();
    cy.get("[data-id='overall-correct']").should("contain", "2/46 (4.35%)");
    cy.get("[data-id='errors']").should("contain", "2");
  });

  it("check playAgain button", () => {
    cy.get("button").click();
    cy.get("[data-id='button-play-again']").click();
    cy.focused().type("a{enter}");
    cy.get("button").click();
    cy.get("[data-id='overall-correct']").should("contain", "1/46 (2.17%)");
  });

  it.only("check goHome button", () => {
    cy.get("button").click();
    cy.get("[data-id='button-go-home']").click();
    cy.get("[data-id='default-view']").should("exist");
  });
});
