import {
  AST, ASTArray, ASTObject,
} from 'src/astBuilder/astBuilder';
import BemEntityBuilder, { BemEntity } from 'src/bemEntityBuilder/bemEntityBuilder';

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

  enter(ast: AST): void {
    const enterStrategyMap = {
      Object: (astObject: ASTObject): void => {
        const bemEntity = this._bemEntityBuilder.build(astObject);

        this._fireEvent({ type: 'enter', target: bemEntity });

        if (bemEntity.content) {
          this.enter(bemEntity.content);
        }

        this._fireEvent({ type: 'leave', target: bemEntity });
      },
      Array: (astArray: ASTArray): void => {
        astArray.children.forEach((child: AST) => {
          this.enter(child);
        });
      },
      default: (): void => {},
    };

    const enter = enterStrategyMap[ast.type]
      ? enterStrategyMap[ast.type]
      : enterStrategyMap.default;

    enter(ast);
  }
}
