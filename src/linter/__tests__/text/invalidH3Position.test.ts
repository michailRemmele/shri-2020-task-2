import Linter from '../../linter';

const correctJson = `[
  {
      "block": "text",
      "mods": { "type": "h2" }
  },
  {
      "block": "text",
      "mods": { "type": "h3" }
  }
]`;

const incorrectJson = `[
  {
      "block": "text",
      "mods": { "type": "h3" }
  },
  {
      "block": "text",
      "mods": { "type": "h2" }
  }
]`;

describe('Lint: TEXT.INVALID_H3_POSITION', () => {
  const config = {
    name: 'orderValidationRule',
    config: {
      entryPoint: '_root',
      block: 'h3',
      after: 'h2',
      errorCode: 'TEXT.INVALID_H3_POSITION',
      errorText: 'H3 can\'t be before than h2',
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
        code: 'TEXT.INVALID_H3_POSITION',
        error: 'H3 can\'t be before than h2',
        location: {
          start: { column: 1, line: 1 },
          end: { column: 2, line: 10 },
        },
      },
    ];

    expect(linter.lint(incorrectJson)).toEqual(expectedResult);
  });
});
