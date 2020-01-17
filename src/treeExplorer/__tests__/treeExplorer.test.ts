import {
  ASTLocation, ASTObject,
} from 'src/astBuilder/astBuilder';
import { BemEntity } from 'src/bemEntityBuilder/bemEntityBuilder';
import TreeExplorer, { TreeExplorerListener, Event } from '../treeExplorer';

class SimpleListener implements TreeExplorerListener {
  private _events: Event[];

  constructor() {
    this._events = [];
  }

  update(event: Event): void {
    this._events.push(event);
  }

  getEvents(): Event[] {
    return this._events;
  }
}

describe('Tree explorer', () => {
  it('Should generate two events for one target', () => {
    const tree = new TreeExplorer();
    const simpleListener = new SimpleListener();

    tree.addListener(simpleListener);

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
            raw: '"hello-world"',
            loc: astLocation,
          },
          loc: astLocation,
        },
      ],
      loc: astLocation,
    };

    const target: BemEntity = {
      name: 'hello-world',
      elemMods: {},
      mix: [],
      location: astLocation,
    };
    const expectedResult: Event[] = [
      {
        type: 'enter',
        target,
      },
      {
        type: 'leave',
        target,
      },
    ];

    tree.enter(astObject);

    expect(simpleListener.getEvents()).toEqual(expectedResult);
  });

  it('Should generate four events for nested targets', () => {
    const tree = new TreeExplorer();
    const simpleListener = new SimpleListener();

    tree.addListener(simpleListener);

    const astLocation: ASTLocation = {
      start: { line: 0, column: 0, offset: 0 },
      end: { line: 0, column: 0, offset: 0 },
      source: null,
    };
    const childAstObject: ASTObject = {
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
            raw: '"hello-world"',
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
            value: 'child',
            raw: '"child"',
            loc: astLocation,
          },
          loc: astLocation,
        },
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
            value: 'content',
            raw: '"content"',
            loc: astLocation,
          },
          value: childAstObject,
          loc: astLocation,
        },
      ],
      loc: astLocation,
    };

    const target: BemEntity = {
      name: 'hello-world',
      elemMods: {},
      mix: [],
      content: childAstObject,
      location: astLocation,
    };
    const targetChild: BemEntity = {
      name: 'hello-world__child',
      elemMods: {},
      mix: [],
      location: astLocation,
    };
    const expectedResult: Event[] = [
      {
        type: 'enter',
        target,
      },
      {
        type: 'enter',
        target: targetChild,
      },
      {
        type: 'leave',
        target: targetChild,
      },
      {
        type: 'leave',
        target,
      },
    ];

    tree.enter(astObject);

    expect(simpleListener.getEvents()).toEqual(expectedResult);
  });
});
