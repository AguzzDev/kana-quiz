declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      playClassicMode(): Chainable<void>;
      playNoErrorsMode(): Chainable<void>;
      playWithTimeMode(): Chainable<void>;
      playNoErrorsWithTimeMode(): Chainable<void>;
      visitHome(): Chainable<void>;
    }
  }
}

export {};
