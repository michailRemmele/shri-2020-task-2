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
      block, standardValueIndex, mod, modValues, entryPoint, entryPointLoc,
    } = this._context;
    const { type, target, original } = event;

    if (target.name === entryPoint && original.location.equals(entryPointLoc) && type === 'leave') {
      this._rule.abort();
      return [];
    }

    if (target.name === block && type === 'enter') {
      if (!target.mods[mod] || modValues.indexOf(target.mods[mod]) !== standardValueIndex + 1) {
        return [this._rule.generateError({ entity: target })];
      }
    }

    return [];
  }
}
