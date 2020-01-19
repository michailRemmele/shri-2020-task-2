import { Error } from 'src/rules/rule';
import ASTBuilder from 'src/astBuilder/astBuilder';
import TreeExplorer from 'src/treeExplorer/treeExplorer';
import RuleBox, { RuleConfig } from 'src/ruleBox/ruleBox';

export default class Linter {
  private _astBuilder: ASTBuilder;
  private _treeExplorer: TreeExplorer;
  private _ruleBox: RuleBox;

  constructor(linterRules: object[]) {
    this._astBuilder = new ASTBuilder();
    this._treeExplorer = new TreeExplorer();

    this._ruleBox = new RuleBox();
    linterRules.forEach((config: object) => {
      this._ruleBox.addRule(config as RuleConfig);
    });

    this._treeExplorer.addListener(this._ruleBox);
  }

  lint(json: string): Error[] {
    const ast = this._astBuilder.build(json);
    this._treeExplorer.enter(ast);

    return this._ruleBox.getErrors();
  }
}
