import Linter from '../../linter';

const correctJson = `
{
  "block": "warning",
  "content": [
      { "block": "placeholder", "mods": { "size": "m" }
  ]
}
`;

const incorrectJson = `
{
  "block": "warning",
  "content": [
      { "block": "placeholder", "mods": { "size": "xl" }
  ]
}
`;

it('WARNING.INVALID_PLACEHOLDER_SIZE rule should passed', () => {
  const linter = new Linter();

  expect(linter.lint(correctJson)).toEqual([]);
});

it('WARNING.INVALID_PLACEHOLDER_SIZE rule should failed', () => {
  const linter = new Linter();

  const expectedResult = [
    {
      code: 'WARNING.INVALID_PLACEHOLDER_SIZE',
      error: 'Допустимые размеры для блока placeholder в блоке warning: s, m, l',
      location: {
        start: { column: 1, line: 1 },
        end: { column: 2, line: 6 },
      },
    },
  ];

  expect(linter.lint(incorrectJson)).toEqual(expectedResult);
});
