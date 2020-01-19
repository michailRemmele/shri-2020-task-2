import Linter from '../../linter';

const correctJson = `{
  "block": "warning",
  "content": [
      { "block": "placeholder", "mods": { "size": "m" }
  ]
}`;

const incorrectJson = `{
  "block": "warning",
  "content": [
      { "block": "placeholder", "mods": { "size": "xl" }
  ]
}`;

describe('Lint: WARNING.INVALID_PLACEHOLDER_SIZE', () => {
  const config = {
    name: 'modValidationRule',
    config: {
      entryPoint: 'warning',
      block: 'placeholder',
      mod: 'size',
      allowedModValues: ['s', 'm', 'l'],
      errorCode: 'WARNING.INVALID_PLACEHOLDER_SIZE',
      errorText: 'Allowed sizes of placeholder block in warning block: s, m, l',
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
        code: 'WARNING.INVALID_PLACEHOLDER_SIZE',
        error: 'Allowed sizes of placeholder block in warning block: s, m, l',
        location: {
          start: { column: 1, line: 1 },
          end: { column: 2, line: 6 },
        },
      },
    ];

    expect(linter.lint(incorrectJson)).toEqual(expectedResult);
  });
});
