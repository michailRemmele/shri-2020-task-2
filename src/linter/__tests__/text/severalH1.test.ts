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
    name: 'uniquenessCheckRule',
    config: {
      entryPoint: '_root',
      block: 'text',
      mod: 'type',
      modValue: 'h1',
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
          start: { column: 3, line: 6 },
          end: { column: 4, line: 9 },
        },
      },
    ];

    expect(linter.lint(incorrectJson)).toEqual(expectedResult);
  });
});
