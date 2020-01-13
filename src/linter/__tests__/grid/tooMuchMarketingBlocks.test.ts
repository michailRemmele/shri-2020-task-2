import Linter from '../../linter';

const correctJson = `
{
  "block": "grid",
  "mods": {
      "m-columns": "10"
  },
  "content": [
      {
          "block": "grid",
          "elem": "fraction",
          "elemMods": {
              "m-col": "8"
          },
          "content": [
              {
                  "block": "payment"
              }
          ]
      },
      {
          "block": "grid",
          "elem": "fraction",
          "elemMods": {
              "m-col": "2"
          },
          "content": [
              {
                  "block": "offer"
              }
          ]
      }
  ]
}
`;

const incorrectJson = `
{
  "block": "grid",
  "mods": {
      "m-columns": "10"
  },
  "content": [
      {
          "block": "grid",
          "elem": "fraction",
          "elemMods": {
              "m-col": "2"
          },
          "content": [
              {
                  "block": "payment"
              }
          ]
      },
      {
          "block": "grid",
          "elem": "fraction",
          "elemMods": {
              "m-col": "8"
          },
          "content": [
              {
                  "block": "offer"
              }
          ]
      }
  ]
}
`;

it('GRID.TOO_MUCH_MARKETING_BLOCKS rule should passed', () => {
  const linter = new Linter();

  expect(linter.lint(correctJson)).toEqual([]);
});

it('GRID.TOO_MUCH_MARKETING_BLOCKS rule should failed', () => {
  const linter = new Linter();

  const expectedResult = [
    {
      code: 'GRID.TOO_MUCH_MARKETING_BLOCKS',
      error: 'Маркетинговые блоки занимают больше половины от всех колонок блока grid',
      location: {
        start: { column: 1, line: 1 },
        end: { column: 2, line: 32 },
      },
    },
  ];

  expect(linter.lint(incorrectJson)).toEqual(expectedResult);
});
