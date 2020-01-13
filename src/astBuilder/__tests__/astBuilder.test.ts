import ASTBuilder from '../astBuilder';

const json = `{
  "a": 1
}`;

it('Should build AST by simple json ', () => {
  const astBuilder = new ASTBuilder();

  const expectedResult = {
    type: 'Object',
    children: [
      {
        type: 'Property',
        key: {
          type: 'Identifier',
          value: 'a',
          raw: '"a"',
          loc: {
            start: { line: 2, column: 3, offset: 4 },
            end: { line: 2, column: 6, offset: 7 },
            source: null,
          },
        },
        value: {
          type: 'Literal',
          value: 1,
          raw: '1',
          loc: {
            start: { line: 2, column: 8, offset: 9 },
            end: { line: 2, column: 9, offset: 10 },
            source: null,
          },
        },
        loc: {
          start: { line: 2, column: 3, offset: 4 },
          end: { line: 2, column: 9, offset: 10 },
          source: null,
        },
      },
    ],
    loc: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 3, column: 2, offset: 12 },
      source: null,
    },
  };

  expect(astBuilder.build(json)).toEqual(expectedResult);
});
