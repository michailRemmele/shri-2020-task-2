import Linter from '../../linter';

const correctJson = `{
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
}`;

const incorrectJson = `{
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
}`;

describe('Lint: GRID.TOO_MUCH_MARKETING_BLOCKS', () => {
  const config = {
    name: 'groupProportionsCheckRule',
    config: {
      entryPoint: 'grid',
      block: 'grid',
      blockSizeMod: 'm-columns',
      maxAllowedBlockPart: 0.5,
      group: ['commercial', 'offer'],
      fraction: 'grid__fraction',
      fractionSizeMod: 'm-col',
      errorCode: 'GRID.TOO_MUCH_MARKETING_BLOCKS',
      errorText: 'Marketing blocks takes more than half from all grid columns',
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
        code: 'GRID.TOO_MUCH_MARKETING_BLOCKS',
        error: 'Marketing blocks takes more than half from all grid columns',
        location: {
          start: { column: 1, line: 1 },
          end: { column: 2, line: 32 },
        },
      },
    ];

    expect(linter.lint(incorrectJson)).toEqual(expectedResult);
  });
});
