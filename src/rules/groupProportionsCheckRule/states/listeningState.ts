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
      block, fraction, fractionSizeMod, blockSizeMod, entryPoint, entryPointLoc,
    } = this._context;
    const { type, target, original } = event;

    if (target.name === entryPoint && original.location.equals(entryPointLoc) && type === 'leave') {
      this._rule.abort();
      return [];
    }

    if (target.name === block && type === 'enter') {
      this._context.blockSize = parseInt(target.mods[blockSizeMod] || 0, 10);
      return [];
    }

    if (target.name === fraction && type === 'enter') {
      this._rule.changeState('accumulation');
      this._context.fractionSize = parseInt(target.mods[fractionSizeMod] || 0, 10);
    }

    return [];
  }
}
