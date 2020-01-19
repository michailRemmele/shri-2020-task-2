import {
  ASTArray, ASTLiteral, ASTLocation, ASTObject, ASTProperty,
} from 'src/astBuilder/astBuilder';
import ASTExtractStrategy from '../astExtractStrategy';

describe('AST extract strategy', () => {
  it('Should return AST Object', () => {
    const extractStrategy = new ASTExtractStrategy();

    const astLocation: ASTLocation = {
      start: { line: 0, column: 0, offset: 0 },
      end: { line: 0, column: 0, offset: 0 },
      source: null,
    };
    const astObject: ASTObject = {
      type: 'Object',
      children: [
        {
          type: 'Property',
          key: {
            type: 'Identifier',
            value: 'a',
            raw: '"a"',
            loc: astLocation,
          },
          value: {
            type: 'Literal',
            value: 1,
            raw: '1',
            loc: astLocation,
          },
          loc: astLocation,
        },
      ],
      loc: astLocation,
    };

    const property: ASTProperty = {
      type: 'Property',
      key: {
        type: 'Identifier',
        value: 'object',
        raw: '"object"',
        loc: astLocation,
      },
      value: astObject,
      loc: astLocation,
    };

    expect(extractStrategy.execute(property)).toEqual(astObject);
  });

  it('Should return AST Array', () => {
    const extractStrategy = new ASTExtractStrategy();

    const astLocation: ASTLocation = {
      start: { line: 0, column: 0, offset: 0 },
      end: { line: 0, column: 0, offset: 0 },
      source: null,
    };
    const astArray: ASTArray = {
      type: 'Array',
      children: [
        {
          type: 'Object',
          children: [
            {
              type: 'Property',
              key: {
                type: 'Identifier',
                value: 'a',
                raw: '"a"',
                loc: astLocation,
              },
              value: {
                type: 'Literal',
                value: 1,
                raw: '1',
                loc: astLocation,
              },
              loc: astLocation,
            },
          ],
          loc: astLocation,
        },
        {
          type: 'Object',
          children: [
            {
              type: 'Property',
              key: {
                type: 'Identifier',
                value: 'b',
                raw: '"b"',
                loc: astLocation,
              },
              value: {
                type: 'Literal',
                value: 2,
                raw: '2',
                loc: astLocation,
              },
              loc: astLocation,
            },
          ],
          loc: astLocation,
        },
      ],
      loc: astLocation,
    };

    const property: ASTProperty = {
      type: 'Property',
      key: {
        type: 'Identifier',
        value: 'array',
        raw: '"array"',
        loc: astLocation,
      },
      value: astArray,
      loc: astLocation,
    };

    expect(extractStrategy.execute(property)).toEqual(astArray);
  });

  it('Should throw error', () => {
    const extractStrategy = new ASTExtractStrategy();

    const astLocation: ASTLocation = {
      start: { line: 0, column: 0, offset: 0 },
      end: { line: 0, column: 0, offset: 0 },
      source: null,
    };
    const astLiteral: ASTLiteral = {
      type: 'Literal',
      value: 1,
      raw: '1',
      loc: astLocation,
    };

    const property: ASTProperty = {
      type: 'Property',
      key: {
        type: 'Identifier',
        value: 'literal',
        raw: '"literal"',
        loc: astLocation,
      },
      value: astLiteral,
      loc: astLocation,
    };

    const expectedErrorMessage = 'Incorrect property value type: Literal. Type should be array or object';

    expect(() => {
      extractStrategy.execute(property);
    }).toThrow(new Error(expectedErrorMessage));
  });
});
