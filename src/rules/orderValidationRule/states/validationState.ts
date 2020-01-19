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
      block, after, buttons, entryPoint, entryPointLoc,
    } = this._context;
    const { type, target, original } = event;

    if (target.name === entryPoint && original.location.equals(entryPointLoc) && type === 'leave') {
      this._rule.abort();
      return [];
    }

    if (target.name === block && type === 'enter') {
      buttons.push(target);
      return [];
    }

    if (target.name === after && type === 'enter') {
      this._rule.changeState('listening');
      this._context.buttons = [];
      return buttons.map((entity) => this._rule.generateError({ entity }));
    }

    return [];
  }
}
