import Linter from '../../linter';

const correctJson = `
[
  {
      "block": "text",
      "mods": { "type": "h1" }
  },
  {
      "block": "text",
      "mods": { "type": "h2" }
  }
]
`;

const incorrectJson = `
[
  {
      "block": "text",
      "mods": { "type": "h1" }
  },
  {
      "block": "text",
      "mods": { "type": "h1" }
  }
]
`;

it('TEXT.SEVERAL_H1 rule should passed', () => {
  const linter = new Linter();

  expect(linter.lint(correctJson)).toEqual([]);
});

it('TEXT.SEVERAL_H1 rule should failed', () => {
  const linter = new Linter();

  const expectedResult = [
    {
      code: 'TEXT.SEVERAL_H1',
      error: 'Заголовок первого уровня на странице должен быть единственным',
      location: {
        start: { column: 1, line: 1 },
        end: { column: 2, line: 10 },
      },
    },
  ];

  expect(linter.lint(incorrectJson)).toEqual(expectedResult);
});
