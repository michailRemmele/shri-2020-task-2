import {
  ASTLiteral,
  ASTLocation, ASTObject, ASTProperty,
} from 'src/astBuilder/astBuilder';
import LiteralMapExtractStrategy from '../literalMapExtractStrategy';

describe('Literal map extract strategy', () => {
  it('Should return empty object', () => {
    const extractStrategy = new LiteralMapExtractStrategy();

    const astLocation: ASTLocation = {
      start: { line: 0, column: 0, offset: 0 },
      end: { line: 0, column: 0, offset: 0 },
      source: null,
    };
    const astObject: ASTObject = {
      type: 'Object',
      children: [],
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

    const expectedValue = {};

    expect(extractStrategy.execute(property)).toEqual(expectedValue);
  });

  it('Should return object', () => {
    const extractStrategy = new LiteralMapExtractStrategy();

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
            value: 'test1',
            raw: '"test1"',
            loc: astLocation,
          },
          value: {
            type: 'Literal',
            value: 100,
            raw: '100',
            loc: astLocation,
          },
          loc: astLocation,
        },
        {
          type: 'Property',
          key: {
            type: 'Identifier',
            value: 'test2',
            raw: '"test2"',
            loc: astLocation,
          },
          value: {
            type: 'Literal',
            value: 'Hello World',
            raw: '"Hello World"',
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

    const expectedValue = {
      test1: 100,
      test2: 'Hello World',
    };

    expect(extractStrategy.execute(property)).toEqual(expectedValue);
  });

  it('Should throw error', () => {
    const extractStrategy = new LiteralMapExtractStrategy();

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
        value: 'object',
        raw: '"object"',
        loc: astLocation,
      },
      value: astLiteral,
      loc: astLocation,
    };

    const expectedErrorMessage = 'Incorrect property value type: Literal. Type should be object';

    expect(() => {
      extractStrategy.execute(property);
    }).toThrow(new Error(expectedErrorMessage));
  });
});
