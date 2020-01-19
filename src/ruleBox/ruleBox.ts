import rules from 'src/rules';
import Rule, { Context, Error as RuleError } from 'src/rules/rule';
import { Event, TreeExplorerListener } from '../treeExplorer/treeExplorer';

export interface RuleConfig {
  name: string;
  config: {
    entryPoint: string;
    block: string;
    errorCode: string;
    errorText: string;
  };
}

export default class RuleBox implements TreeExplorerListener {
  private _rules: object;
  private _activeRules: Rule[];
  private _errors: RuleError[];

  constructor() {
    this._rules = {};
    this._activeRules = [];
    this._errors = [];
  }

  addRule(ruleConfig: RuleConfig): void {
    const { name, config } = ruleConfig;

    if (!rules[name]) {
      throw new Error(`No rule found with this name: ${name}`);
    }

    this._rules[config.entryPoint] = this._rules[config.entryPoint] || [];
    this._rules[config.entryPoint].push({
      RuleImpl: rules[name],
      config,
    });
  }

  getErrors(): RuleError[] {
    return this._errors;
  }

  clearErrors(): void {
    this._errors = [];
  }

  update(event: Event): void {
    if (this._rules[event.target.name] && event.type === 'enter') {
      this._rules[event.target.name].forEach((entry) => {
        const { RuleImpl, config } = entry;
        const context: Context = {
          ...config,
          entryPointLoc: event.target.location,
        };

        this._activeRules.push(new RuleImpl(context));
      });
    }

    this._activeRules = this._activeRules.filter((rule: Rule) => {
      this._errors = this._errors.concat(rule.process(event));

      return !rule.isAborted();
    });
  }
}
