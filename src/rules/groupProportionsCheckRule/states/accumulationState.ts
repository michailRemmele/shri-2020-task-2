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
      group, fraction, blockSize, maxAllowedBlockPart, entryPoint, entryPointLoc,
    } = this._context;
    const { type, target, original } = event;

    if (target.name === entryPoint && original.location.equals(entryPointLoc) && type === 'leave') {
      this._rule.abort();
      return [];
    }

    if (target.name === fraction && type === 'leave') {
      this._context.fractionSize = 0;
      this._rule.changeState('listening');
    }

    if (group.includes(target.name) && type === 'enter') {
      this._context.groupSize += this._context.fractionSize;
      this._context.fractionSize = 0;

      if (this._context.groupSize > maxAllowedBlockPart * blockSize) {
        this._rule.abort();
        return [this._rule.generateError()];
      }
    }

    return [];
  }
}
