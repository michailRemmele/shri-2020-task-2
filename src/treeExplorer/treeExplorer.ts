import {
  AST, ASTArray, ASTObject,
} from 'src/astBuilder/astBuilder';
import BemEntityBuilder, { BemEntity } from 'src/bemEntityBuilder/bemEntityBuilder';
import Location from 'src/location';

export interface Event {
  type: 'enter' | 'leave';
  target: BemEntity;
}

export interface TreeExplorerListener {
  update: (event: Event) => void;
}

export default class TreeExplorer {
  private _bemEntityBuilder: BemEntityBuilder;
  private _listeners: TreeExplorerListener[];

  constructor() {
    this._bemEntityBuilder = new BemEntityBuilder();
    this._listeners = [];
  }

  _fireEvent(event: Event): void {
    this._listeners.forEach((listener) => {
      listener.update(event);
    });
  }

  addListener(listener: TreeExplorerListener): void {
    this._listeners.push(listener);
  }

  _enter(ast: AST): void {
    const enterStrategyMap = {
      Object: (astObject: ASTObject): void => {
        const bemEntity = this._bemEntityBuilder.build(astObject);

        this._fireEvent({ type: 'enter', target: bemEntity });

        if (bemEntity.content) {
          this._enter(bemEntity.content);
        }

        this._fireEvent({ type: 'leave', target: bemEntity });
      },
      Array: (astArray: ASTArray): void => {
        astArray.children.forEach((child: AST) => {
          this._enter(child);
        });
      },
      default: (): void => {},
    };

    const enter = enterStrategyMap[ast.type]
      ? enterStrategyMap[ast.type]
      : enterStrategyMap.default;

    enter(ast);
  }

  enter(ast: AST): void {
    const root: BemEntity = {
      name: '_root',
      elemMods: {},
      mix: [],
      location: new Location(ast.loc),
    };

    this._fireEvent({ type: 'enter', target: root });
    this._enter(ast);
    this._fireEvent({ type: 'leave', target: root });
  }
}
