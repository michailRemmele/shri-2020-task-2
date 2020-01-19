import lint from 'src/index';

const textsSizesShouldBeEqual = `{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "l" } },
      { "block": "text", "mods": { "size": "m" } }
  ]
}`;

const invalidButtonSize = `{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "m" } },
      { "block": "button", "mods": { "size": "m" } }
  ]
}`;

const invalidButtonPosition = `{
  "block": "warning",
  "content": [
      { "block": "text", "mods": { "size": "m" } },
      { "block": "button", "mods": { "size": "l" } },
      { "block": "placeholder", "mods": { "size": "m" } }
  ]
}`;

const invalidPlaceholderSize = `{
  "block": "warning",
  "content": [
      { "block": "placeholder", "mods": { "size": "xl" } }
  ]
}`;

const severalH1 = `{
  "block": "page",
  "content": [
      {
          "block": "text",
          "mods": { "type": "h1" }
      },
      {
          "block": "text",
          "mods": { "type": "h1" }
      }
  ]
}`;

const invalidH2Position = `{
  "block": "page",
  "content": [
      {
          "block": "text",
          "mods": { "type": "h2" }
      },
      {
          "block": "text",
          "mods": { "type": "h1" }
      }
  ]
}`;

const invalidH3Position = `{
  "block": "page",
  "content": [
      {
          "block": "text",
          "mods": { "type": "h3" }
      },
      {
          "block": "text",
          "mods": { "type": "h2" }
      }
  ]
}`;

const tooMuchMarketingBlocks = `{
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

describe('Lint main function', () => {
  it('WARNING.TEXT_SIZES_SHOULD_BE_EQUAL', () => {
    const expectedResult = [
      {
        code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
        error: 'Texts sizes in warning block should be equals',
        location: {
          start: { column: 1, line: 1 },
          end: { column: 2, line: 7 },
        },
      },
    ];

    expect(lint(textsSizesShouldBeEqual)).toEqual(expectedResult);
  });

  it('WARNING.INVALID_BUTTON_SIZE', () => {
    expect(lint(invalidButtonSize)).toEqual([
      {
        code: 'WARNING.INVALID_BUTTON_SIZE',
        error: 'Size of button in warning block should be one step larger than standard',
        location: {
          start: { column: 7, line: 5 },
          end: { column: 53, line: 5 },
        },
      },
    ]);
  });

  it('WARNING.INVALID_BUTTON_POSITION', () => {
    const expectedResult = [
      {
        code: 'WARNING.INVALID_BUTTON_POSITION',
        error: 'Button in warning block can\'t be before than placeholder',
        location: {
          start: { column: 7, line: 5 },
          end: { column: 53, line: 5 },
        },
      },
    ];

    expect(lint(invalidButtonPosition)).toEqual(expectedResult);
  });

  it('WARNING.INVALID_PLACEHOLDER_SIZE', () => {
    const expectedResult = [
      {
        code: 'WARNING.INVALID_PLACEHOLDER_SIZE',
        error: 'Allowed sizes of placeholder block in warning block: s, m, l',
        location: {
          start: { column: 7, line: 4 },
          end: { column: 59, line: 4 },
        },
      },
    ];

    expect(lint(invalidPlaceholderSize)).toEqual(expectedResult);
  });

  it('TEXT.SEVERAL_H1', () => {
    const expectedResult = [
      {
        code: 'TEXT.SEVERAL_H1',
        error: 'H1 should be uniqueness',
        location: {
          start: { column: 7, line: 8 },
          end: { column: 8, line: 11 },
        },
      },
    ];

    expect(lint(severalH1)).toEqual(expectedResult);
  });

  it('TEXT.INVALID_H2_POSITION', () => {
    const expectedResult = [
      {
        code: 'TEXT.INVALID_H2_POSITION',
        error: 'H2 can\'t be before than h1',
        location: {
          start: { column: 7, line: 4 },
          end: { column: 8, line: 7 },
        },
      },
    ];

    expect(lint(invalidH2Position)).toEqual(expectedResult);
  });

  it('TEXT.INVALID_H3_POSITION', () => {
    const expectedResult = [
      {
        code: 'TEXT.INVALID_H3_POSITION',
        error: 'H3 can\'t be before than h2',
        location: {
          start: { column: 7, line: 4 },
          end: { column: 8, line: 7 },
        },
      },
    ];

    expect(lint(invalidH3Position)).toEqual(expectedResult);
  });

  it('GRID.TOO_MUCH_MARKETING_BLOCKS', () => {
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

    expect(lint(tooMuchMarketingBlocks)).toEqual(expectedResult);
  });
});
