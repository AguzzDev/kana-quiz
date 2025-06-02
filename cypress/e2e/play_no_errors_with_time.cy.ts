import { hiraganaMainKanaData } from "../../src/lib/data";

describe("play no errors with time mode", () => {
  beforeEach(() => {
    cy.visitHome();
    cy.window().then((win) => {
      (win as Window).CYPRESS_TEST = true;
    });
    cy.playNoErrorsWithTimeMode();
  });

  it("perfect", () => {
    hiraganaMainKanaData.forEach((d) => {
      cy.focused().type(`${d.romaji}{enter}`);
    });
    cy.get("[data-id='overall-correct']").should("contain", "46/46 (100.00%)");
  });

  it("valid and error", () => {
    let i = 0;

    while (i < 2) {
      const cond = i % 2 === 0;
      const char = cond ? hiraganaMainKanaData[i].romaji : "asd";
      cy.focused().type(`${char}{enter}`);
      i++;
    }

    cy.get("[data-id='overall-correct']").should("contain", "1/46 (2.17%)");
    cy.get("[data-id='errors']").should("contain", "1");
  });

  it("valid, error and try one more", () => {
    let i = 0;

    const attempt = (): void => {
      const cond = i % 2 === 0;
      const char = cond ? hiraganaMainKanaData[i].romaji : "asd";

      cy.get("body").then(($body) => {
        const hasInput = $body.find("input").length > 0;
        if (hasInput) {
          cy.focused()
            .type(`${char}{enter}`)
            .then(() => {
              i++;
              attempt();
            });
        }
      });
    };

    attempt();

    cy.get("[data-id='overall-correct']").should("contain", "1/46 (2.17%)");
    cy.get("[data-id='errors']").should("contain", "1");
  });

  it("randomly positions", () => {
    let i = 0;
    let tryTrues = 0;
    const positions = [2, 5, 7, 10];

    const attempt = (): void => {
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

    cy.get("[data-id='overall-correct']").should("contain", "2/46 (4.35%)");
    cy.get("[data-id='errors']").should("contain", "1");
  });

  it("wait 10s on the 5th try and the game ends", () => {
    let i = 0;

    const attempt = () => {
      if (i === 5) {
        cy.wait(10000);
      }

      cy.get("body").then(($body) => {
        const char = hiraganaMainKanaData[i].romaji;
        const hasInput = $body.find("input").length > 0;

        if (hasInput) {
          cy.focused()
            .type(`${char}{enter}`)
            .then(() => {
              i++;
              attempt();
            });
        }
      });
    };

    attempt();
    cy.get("[data-id='overall-correct']").should("contain", "5/46 (10.87%)");
    cy.get("[data-id='time']").should("contain", "00:10");
  });
});
