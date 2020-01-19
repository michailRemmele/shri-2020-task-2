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
      "mods": { "type": "h1" }
  },
  {
      "block": "text",
      "mods": { "type": "h1" }
  }
]`;

describe('Lint: TEXT.SEVERAL_H1', () => {
  const config = {
    name: 'orderValidationRule',
    config: {
      entryPoint: '_root',
      block: 'h1',
      errorCode: 'TEXT.SEVERAL_H1',
      errorText: 'H1 should be uniqueness',
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
        code: 'TEXT.SEVERAL_H1',
        error: 'H1 should be uniqueness',
        location: {
          start: { column: 1, line: 1 },
          end: { column: 2, line: 10 },
        },
      },
    ];

    expect(linter.lint(incorrectJson)).toEqual(expectedResult);
  });
});
