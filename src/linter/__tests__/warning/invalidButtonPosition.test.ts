import Linter from '../../linter';

const correctJson = `{
  "block": "warning",
  "content": [
      { "block": "placeholder", "mods": { "size": "m" } },
      { "block": "button", "mods": { "size": "m" } }
  ]
}`;

const incorrectJson = `{
  "block": "warning",
  "content": [
      { "block": "button", "mods": { "size": "m" } },
      { "block": "placeholder", "mods": { "size": "m" } }
  ]
}`;

describe('Lint: WARNING.INVALID_BUTTON_POSITION', () => {
  const config = {
    name: 'orderValidationRule',
    config: {
      entryPoint: 'warning',
      block: 'button',
      after: 'placeholder',
      errorCode: 'WARNING.INVALID_BUTTON_POSITION',
      errorText: 'Button in warning block can\'t be before than placeholder',
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
        code: 'WARNING.INVALID_BUTTON_POSITION',
        error: 'Button in warning block can\'t be before than placeholder',
        location: {
          start: { column: 1, line: 1 },
          end: { column: 2, line: 7 },
        },
      },
    ];

    expect(linter.lint(incorrectJson)).toEqual(expectedResult);
  });
});
