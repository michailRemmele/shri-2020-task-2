import {
  ASTArray,
  ASTLocation, ASTObject,
} from 'src/astBuilder/astBuilder';
import Location from 'src/location';
import BemEntityBuilder, { BemEntity } from '../bemEntityBuilder';

describe('Bem entity builder', () => {
  it('Should build empty bem entity', () => {
    const bemEntityBuilder = new BemEntityBuilder();

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

    const expectedResult: BemEntity = {
      name: '',
      elemMods: {},
      mix: [],
      location: new Location(astLocation),
    };

    expect(bemEntityBuilder.build(astObject)).toEqual(expectedResult);
  });

  it('Should build block bem entity with mods', () => {
    const bemEntityBuilder = new BemEntityBuilder();

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
            value: 'block',
            raw: '"block"',
            loc: astLocation,
          },
          value: {
            type: 'Literal',
            value: 'hello-world',
            raw: '"hello-world',
            loc: astLocation,
          },
          loc: astLocation,
        },
        {
          type: 'Property',
          key: {
            type: 'Identifier',
            value: 'elemMods',
            raw: '"elemMods"',
            loc: astLocation,
          },
          value: {
            type: 'Object',
            children: [
              {
                type: 'Property',
                key: {
                  type: 'Identifier',
                  value: 'vertical-align',
                  raw: '"vertical-align"',
                  loc: astLocation,
                },
                value: {
                  type: 'Literal',
                  value: 'center',
                  raw: '"center"',
                  loc: astLocation,
                },
                loc: astLocation,
              },
              {
                type: 'Property',
                key: {
                  type: 'Identifier',
                  value: 'space-a',
                  raw: '"space-a"',
                  loc: astLocation,
                },
                value: {
                  type: 'Literal',
                  value: 'xxl',
                  raw: '"xxl"',
                  loc: astLocation,
                },
                loc: astLocation,
              },
            ],
            loc: astLocation,
          },
          loc: astLocation,
        },
      ],
      loc: astLocation,
    };

    const expectedResult: BemEntity = {
      name: 'hello-world',
      elemMods: {
        'vertical-align': 'center',
        'space-a': 'xxl',
      },
      mix: [],
      location: new Location(astLocation),
    };

    expect(bemEntityBuilder.build(astObject)).toEqual(expectedResult);
  });

  it('Should build element bem entity with mix', () => {
    const bemEntityBuilder = new BemEntityBuilder();

    const astLocation: ASTLocation = {
      start: { line: 0, column: 0, offset: 0 },
      end: { line: 0, column: 0, offset: 0 },
      source: null,
    };
    const mixAstObject: ASTObject = {
      type: 'Object',
      children: [],
      loc: astLocation,
    };
    const astObject: ASTObject = {
      type: 'Object',
      children: [
        {
          type: 'Property',
          key: {
            type: 'Identifier',
            value: 'block',
            raw: '"block"',
            loc: astLocation,
          },
          value: {
            type: 'Literal',
            value: 'hello',
            raw: '"hello',
            loc: astLocation,
          },
          loc: astLocation,
        },
        {
          type: 'Property',
          key: {
            type: 'Identifier',
            value: 'elem',
            raw: '"elem"',
            loc: astLocation,
          },
          value: {
            type: 'Literal',
            value: 'world',
            raw: '"world',
            loc: astLocation,
          },
          loc: astLocation,
        },
        {
          type: 'Property',
          key: {
            type: 'Identifier',
            value: 'mix',
            raw: '"mix"',
            loc: astLocation,
          },
          value: mixAstObject,
          loc: astLocation,
        },
      ],
      loc: astLocation,
    };

    const expectedResult: BemEntity = {
      name: 'hello__world',
      elemMods: {},
      mix: [
        {
          name: '',
          elemMods: {},
          mix: [],
          location: new Location(astLocation),
        },
      ],
      location: new Location(astLocation),
    };

    expect(bemEntityBuilder.build(astObject)).toEqual(expectedResult);
  });

  it('Should build block bem entity with content', () => {
    const bemEntityBuilder = new BemEntityBuilder();

    const astLocation: ASTLocation = {
      start: { line: 0, column: 0, offset: 0 },
      end: { line: 0, column: 0, offset: 0 },
      source: null,
    };
    const childAstObject: ASTObject = {
      type: 'Object',
      children: [],
      loc: astLocation,
    };
    const astArray: ASTArray = {
      type: 'Array',
      children: [
        childAstObject,
        childAstObject,
      ],
      loc: astLocation,
    };
    const astObject: ASTObject = {
      type: 'Object',
      children: [
        {
          type: 'Property',
          key: {
            type: 'Identifier',
            value: 'block',
            raw: '"block"',
            loc: astLocation,
          },
          value: {
            type: 'Literal',
            value: 'hello',
            raw: '"hello',
            loc: astLocation,
          },
          loc: astLocation,
        },
        {
          type: 'Property',
          key: {
            type: 'Identifier',
            value: 'content',
            raw: '"content"',
            loc: astLocation,
          },
          value: astArray,
          loc: astLocation,
        },
      ],
      loc: astLocation,
    };

    const expectedResult: BemEntity = {
      name: 'hello',
      elemMods: {},
      mix: [],
      content: astArray,
      location: new Location(astLocation),
    };

    expect(bemEntityBuilder.build(astObject)).toEqual(expectedResult);
  });
});
