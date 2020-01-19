import { Event } from 'src/treeExplorer/treeExplorer';
import Rule, { Error, State } from '../../rule';
import Context from '../context';

export default class AccumulationState implements State {
  private _rule: Rule;
  private _context: Context;

  constructor(rule: Rule, context: Context) {
    this._rule = rule;
    this._context = context;
  }

  process(event: Event): Error[] {
    const {
      block, standard, mod, modValues, accumulatedDebt, entryPoint, entryPointLoc,
    } = this._context;
    const { type, target, original } = event;

    if (target.name === entryPoint && original.location.equals(entryPointLoc) && type === 'leave') {
      this._rule.abort();
      return accumulatedDebt.map((entity) => this._rule.generateError({ entity }));
    }

    if (target.name === block && type === 'enter') {
      accumulatedDebt.push(target);
      return [];
    }

    if (target.name === standard && type === 'enter' && target.mods[mod]) {
      this._context.standardValueIndex = modValues.indexOf(target.mods[mod]);
      const { standardValueIndex } = this._context;

      if (standardValueIndex === -1) {
        return [];
      }

      this._rule.changeState('validation');
      this._context.accumulatedDebt = [];
      return accumulatedDebt.reduce((errors: Error[], entity) => {
        if (!entity.mods[mod] || modValues.indexOf(entity.mods[mod]) !== standardValueIndex + 1) {
          errors.push(this._rule.generateError({ entity }));
        }
        return errors;
      }, []);
    }

    return [];
  }
}
