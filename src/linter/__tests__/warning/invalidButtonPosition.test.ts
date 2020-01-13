import Linter from '../../linter';

const correctJson = `
{
  "block": "warning",
  "content": [
      { "block": "placeholder", "mods": { "size": "m" } },
      { "block": "button", "mods": { "size": "m" } }
  ]
}
`;

const incorrectJson = `
{
  "block": "warning",
  "content": [
      { "block": "button", "mods": { "size": "m" } },
      { "block": "placeholder", "mods": { "size": "m" } }
  ]
}
`;

it('WARNING.INVALID_BUTTON_POSITION rule should passed', () => {
  const linter = new Linter();

  expect(linter.lint(correctJson)).toEqual([]);
});

it('WARNING.INVALID_BUTTON_POSITION rule should failed', () => {
  const linter = new Linter();

  const expectedResult = [
    {
      code: 'WARNING.INVALID_BUTTON_POSITION',
      error: 'Блок button в блоке warning не может находиться перед блоком placeholder на том же или более глубоком уровне вложенности',
      location: {
        start: { column: 1, line: 1 },
        end: { column: 2, line: 7 },
      },
    },
  ];

  expect(linter.lint(incorrectJson)).toEqual(expectedResult);
});
