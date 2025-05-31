import {
  hiraganaYouonKanaData,
  katakanaYouonKanaData,
} from "../../src/lib/data";

describe("play with time mode", () => {
  const data = [...hiraganaYouonKanaData, ...katakanaYouonKanaData];

  beforeEach(() => {
    cy.visitHome();
    cy.window().then((win) => {
      (win as Window).CYPRESS_TEST = true;
    });
    cy.playWithTimeMode();
  });

  it("100% quiz", () => {
    data.forEach((d) => {
      cy.focused().type(`${d.romaji}{enter}`);
    });
    cy.get("[data-id='overall-correct']").should(
      "contain",
      "Overall Correct: 72/72 (100.00%)"
    );
    cy.get("[data-id='errors']").should("contain", "0");
  });

  it("wait 30s on the 5th try and the game ends", () => {
    let i = 0;

    const attempt = () => {
      if (i === 5) {
        cy.wait(30000);
      }

      cy.get("body").then(($body) => {
        const char = data[i].romaji;
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
    cy.get("[data-id='overall-correct']").should("contain", "5/72 (6.94%)");
    cy.get("[data-id='time']").should("contain", "00:30");
  });
});
