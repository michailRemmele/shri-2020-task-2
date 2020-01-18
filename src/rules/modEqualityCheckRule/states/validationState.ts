import { Event } from 'src/treeExplorer/treeExplorer';
import Rule, { Error, State } from '../../rule';
import Context from '../context';

export default class ValidationState implements State {
  private _rule: Rule;
  private _context: Context;

  constructor(rule: Rule, context: Context) {
    this._rule = rule;
    this._context = context;
  }

  process(event: Event): Error[] {
    const {
      block, mod, modValue, entryPoint, entryPointLoc,
    } = this._context;
    const { type, target } = event;

    if (target.name === entryPoint && target.location.equals(entryPointLoc) && type === 'leave') {
      this._rule.abort();
      return [];
    }

    if (target.name !== block) {
      return [];
    }

    if (!target.elemMods[mod] || target.elemMods[mod] !== modValue) {
      return [this._rule.generateError()];
    }

    return [];
  }
}
