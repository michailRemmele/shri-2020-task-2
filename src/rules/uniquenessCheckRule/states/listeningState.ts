import { Event } from 'src/treeExplorer/treeExplorer';
import Rule, { Error, State } from '../../rule';
import Context from '../context';

export default class ListeningState implements State {
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
    const { type, target, original } = event;

    if (target.name === entryPoint && original.location.equals(entryPointLoc) && type === 'leave') {
      this._rule.abort();
      return [];
    }

    if (target.name !== block || type !== 'enter') {
      return [];
    }

    if (!mod || !modValue || (target.mods[mod] && target.mods[mod] === modValue)) {
      this._context.blockFound = true;
      this._rule.changeState('validation');
    }

    return [];
  }
}
