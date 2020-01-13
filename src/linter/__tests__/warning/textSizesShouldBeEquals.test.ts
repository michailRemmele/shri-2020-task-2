import Linter from '../../linter';

const correctJson = `
{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "l" } },
      { "block": "text", "mods": { "size": "l" } }
  ]
}
`;

const incorrectJson = `
{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "l" } },
      { "block": "text", "mods": { "size": "m" } }
  ]
}
`;

it('WARNING.TEXT_SIZES_SHOULD_BE_EQUAL rule should passed', () => {
  const linter = new Linter();

  expect(linter.lint(correctJson)).toEqual([]);
});

it('WARNING.TEXT_SIZES_SHOULD_BE_EQUAL rule should failed', () => {
  const linter = new Linter();

  const expectedResult = [
    {
      code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
      error: 'Тексты в блоке warning должны быть одного размера',
      location: {
        start: { column: 1, line: 1 },
        end: { column: 2, line: 7 },
      },
    },
  ];

  expect(linter.lint(incorrectJson)).toEqual(expectedResult);
});
