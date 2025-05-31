import { katakanaDakutenKanaData } from "../../src/lib/data";

describe("play no errors mode", () => {
  beforeEach(() => {
    cy.visitHome();
    cy.window().then((win) => {
      (win as Window).CYPRESS_TEST = true;
    });
    cy.playNoErrorsMode();
  });

  it("perfect", () => {
    katakanaDakutenKanaData.forEach((d) => {
      cy.focused().type(`${d.romaji}{enter}`);
    });
    cy.get("[data-id='overall-correct']").should(
      "contain",
      "25/25 (100.00%)"
    );
  });

  it("valid and error", () => {
    let i = 0;

    while (i < 2) {
      const cond = i % 2 === 0;
      const char = cond ? katakanaDakutenKanaData[i].romaji : "asd";
      cy.focused().type(`${char}{enter}`);
      i++;
    }

    cy.get("[data-id='overall-correct']").should(
      "contain",
      "1/25 (4.00%)"
    );
    cy.get("[data-id='errors']").should("contain", "1");
  });

  it("valid, error and try one more", () => {
    let i = 0;

    const attempt = (): void => {
      const cond = i % 2 === 0;
      const char = cond ? katakanaDakutenKanaData[i].romaji : "asd";

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

    cy.get("[data-id='overall-correct']").should(
      "contain",
      "1/25 (4.00%)"
    );
    cy.get("[data-id='errors']").should("contain", "1");
  });

  it.only("randomly positions", () => {
    let i = 0;
    let tryTrues = 0;
    const positions = [2, 5, 7, 10];

    const attempt = (): void => {
      const cond = positions[i] === 2 || positions[i] === 5;
      const pos = positions[i];
      const char = cond ? katakanaDakutenKanaData[pos].romaji : "asd";

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

    cy.get("[data-id='overall-correct']").should(
      "contain",
      "2/25 (8.00%)"
    );
    cy.get("[data-id='errors']").should("contain", "1");
  });
});
