import ASTBuilder from '../astBuilder/astBuilder';
import TreeExplorer from '../treeExplorer/treeExplorer';

export interface LocationPoint {
  column: number;
  lint: number;
}

export interface Location {
  start: LocationPoint;
  end: LocationPoint;
}

export interface Error {
  code: string;
  error: string;
  location: Location;
}

export default class Linter {
  private _astBuilder: ASTBuilder;
  private _treeExplorer: TreeExplorer;

  constructor() {
    this._astBuilder = new ASTBuilder();
    this._treeExplorer = new TreeExplorer();
  }

  lint(json: string): Error[] {
    const ast = this._astBuilder.build(json);
    this._treeExplorer.enter(ast);

    return [];
  }
}
