import Linter from '../../linter';

const correctJson = `{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "l" } },
      { "block": "text", "mods": { "size": "l" } }
  ]
}`;

const incorrectJson = `{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "l" } },
      { "block": "text", "mods": { "size": "m" } }
  ]
}`;

describe('Lint: WARNING.TEXT_SIZES_SHOULD_BE_EQUAL', () => {
  const config = {
    name: 'modEqualityCheckRule',
    config: {
      entryPoint: 'warning',
      block: 'text',
      mod: 'size',
      errorCode: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
      errorText: 'Texts sizes in warning block should be equals',
    },
  };

  it('rule should pass', () => {
    const linter = new Linter([config]);

    expect(linter.lint(correctJson)).toEqual([]);
  });

  it('rule should fail', () => {
    const linter = new Linter([config]);

    const expectedResult = [
      {
        code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
        error: 'Texts sizes in warning block should be equals',
        location: {
          start: { column: 1, line: 1 },
          end: { column: 2, line: 7 },
        },
      },
    ];

    expect(linter.lint(incorrectJson)).toEqual(expectedResult);
  });
});
