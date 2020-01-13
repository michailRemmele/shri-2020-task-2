import Linter from '../../linter';

const correctJson = `
{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "l" } },
      { "block": "button", "mods": { "size": "xl" } }
  ]
}
`;

const incorrectJson = `
{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "l" } },
      { "block": "button", "mods": { "size": "s" } }
  ]
}
`;

it('WARNING.INVALID_BUTTON_SIZE rule should passed', () => {
  const linter = new Linter();

  expect(linter.lint(correctJson)).toEqual([]);
});

it('WARNING.INVALID_BUTTON_SIZE rule should failed', () => {
  const linter = new Linter();

  const expectedResult = [
    {
      code: 'WARNING.INVALID_BUTTON_SIZE',
      error: 'Размер кнопки блока warning должен быть на 1 шаг больше эталонного',
      location: {
        start: { column: 1, line: 1 },
        end: { column: 2, line: 7 },
      },
    },
  ];

  expect(linter.lint(incorrectJson)).toEqual(expectedResult);
});
