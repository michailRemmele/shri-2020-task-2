import {
  AST, ASTArray, ASTObject,
} from 'src/astBuilder/astBuilder';
import BemEntityBuilder, { BemEntity } from 'src/bemEntityBuilder/bemEntityBuilder';
import Location from 'src/location';

export interface Event {
  type: 'enter' | 'leave';
  target: BemEntity;
  isMix: boolean;
  original: BemEntity;
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

  _notifyListeners(event): void {
    this._listeners.forEach((listener) => {
      listener.update(event);
    });
  }

  _fireEvent(type, target): void {
    this._notifyListeners({
      type,
      target,
      original: target,
      isMix: false,
    });

    target.mix.forEach((mixedEntity: BemEntity) => {
      this._notifyListeners({
        type,
        target: mixedEntity,
        original: target,
        isMix: true,
      });
    });
  }

  addListener(listener: TreeExplorerListener): void {
    this._listeners.push(listener);
  }

  _enter(ast: AST): void {
    const enterStrategyMap = {
      Object: (astObject: ASTObject): void => {
        const bemEntity = this._bemEntityBuilder.build(astObject);

        this._fireEvent('enter', bemEntity);
        if (bemEntity.content) {
          this._enter(bemEntity.content);
        }
        this._fireEvent('leave', bemEntity);
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

    this._fireEvent('enter', root);
    this._enter(ast);
    this._fireEvent('leave', root);
  }
}
