import {
  ASTLiteral, ASTLocation, ASTObject, ASTProperty,
} from 'src/astBuilder/astBuilder';
import LiteralExtractStrategy from '../literalExtractStrategy';

describe('Literal extract strategy', () => {
  it('Should return number', () => {
    const extractStrategy = new LiteralExtractStrategy();

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

    const expectedValue = 1;

    expect(extractStrategy.execute(property)).toEqual(expectedValue);
  });

  it('Should return string', () => {
    const extractStrategy = new LiteralExtractStrategy();

    const astLocation: ASTLocation = {
      start: { line: 0, column: 0, offset: 0 },
      end: { line: 0, column: 0, offset: 0 },
      source: null,
    };
    const astLiteral: ASTLiteral = {
      type: 'Literal',
      value: 'hello world',
      raw: '"1"',
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

    const expectedValue = 'hello world';

    expect(extractStrategy.execute(property)).toEqual(expectedValue);
  });

  it('Should throw error', () => {
    const extractStrategy = new LiteralExtractStrategy();

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

    const expectedErrorMessage = 'Incorrect property value type: Object. Type should be literal';

    expect(() => {
      extractStrategy.execute(property);
    }).toThrow(new Error(expectedErrorMessage));
  });
});
