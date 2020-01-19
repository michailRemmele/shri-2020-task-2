import Linter from '../../linter';

const correctJson = `{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "l" } },
      { "block": "button", "mods": { "size": "xl" } }
  ]
}`;

const incorrectJson = `{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "l" } },
      { "block": "button", "mods": { "size": "s" } }
  ]
}`;

describe('Lint: WARNING.INVALID_BUTTON_SIZE', () => {
  const config = {
    name: 'modGrowthCheckRule',
    config: {
      entryPoint: 'warning',
      block: 'button',
      standard: 'text',
      mod: 'size',
      modValues: ['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', 'xxxxl', 'xxxxxl'],
      errorCode: 'WARNING.INVALID_BUTTON_SIZE',
      errorText: 'Size of button in warning block should be one step larger than standard',
    },
  };

  it('Rule should pass', () => {
    const linter = new Linter([config]);

    expect(linter.lint(correctJson)).toEqual([]);
  });

  it('Rule should failed', () => {
    const linter = new Linter([config]);

    const expectedResult = [
      {
        code: 'WARNING.INVALID_BUTTON_SIZE',
        error: 'Size of button in warning block should be one step larger than standard',
        location: {
          start: { column: 7, line: 5 },
          end: { column: 53, line: 5 },
        },
      },
    ];

    expect(linter.lint(incorrectJson)).toEqual(expectedResult);
  });
});
