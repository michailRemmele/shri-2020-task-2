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
      block: 'text',
      mod: 'type',
      modValue: 'h3',
      after: 'text',
      afterMod: 'type',
      afterModValue: 'h2',
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
          start: { column: 3, line: 2 },
          end: { column: 4, line: 5 },
        },
      },
    ];

    expect(linter.lint(incorrectJson)).toEqual(expectedResult);
  });
});
