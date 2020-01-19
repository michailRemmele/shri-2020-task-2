import Linter from '../../linter';

const correctJson = `[
  {
      "block": "text",
      "mods": { "type": "h1" }
  },
  {
      "block": "text",
      "mods": { "type": "h2" }
  }
]`;

const incorrectJson = `[
  {
      "block": "text",
      "mods": { "type": "h2" }
  },
  {
      "block": "text",
      "mods": { "type": "h1" }
  }
]`;

describe('Lint: TEXT.INVALID_H2_POSITION', () => {
  const config = {
    name: 'orderValidationRule',
    config: {
      entryPoint: '_root',
      block: 'h2',
      after: 'h1',
      errorCode: 'TEXT.INVALID_H2_POSITION',
      errorText: 'H2 can\'t be before than h1',
    },
  };

  it('Rule should pass', () => {
    const linter = new Linter([config]);

    expect(linter.lint(correctJson)).toEqual([]);
  });

  it('Rule should fail', () => {
    const linter = new Linter([config]);

    const expectedResult = [
      {
        code: 'TEXT.INVALID_H2_POSITION',
        error: 'H2 can\'t be before than h1',
        location: {
          start: { column: 1, line: 1 },
          end: { column: 2, line: 10 },
        },
      },
    ];

    expect(linter.lint(incorrectJson)).toEqual(expectedResult);
  });
});
