import Linter from '../../linter';

const correctJson = `
[
  {
      "block": "text",
      "mods": { "type": "h2" }
  },
  {
      "block": "text",
      "mods": { "type": "h3" }
  }
]
`;

const incorrectJson = `
[
  {
      "block": "text",
      "mods": { "type": "h3" }
  },
  {
      "block": "text",
      "mods": { "type": "h2" }
  }
]
`;

it('TEXT.INVALID_H3_POSITION rule should passed', () => {
  const linter = new Linter();

  expect(linter.lint(correctJson)).toEqual([]);
});

it('TEXT.INVALID_H3_POSITION rule should failed', () => {
  const linter = new Linter();

  const expectedResult = [
    {
      code: 'TEXT.INVALID_H3_POSITION',
      error: 'Заголовок третьего уровня не может находиться перед заголовком второго уровня на том же или более глубоком уровне вложенности',
      location: {
        start: { column: 1, line: 1 },
        end: { column: 2, line: 10 },
      },
    },
  ];

  expect(linter.lint(incorrectJson)).toEqual(expectedResult);
});
