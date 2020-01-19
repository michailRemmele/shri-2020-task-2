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
      block, mod, modValue, after, afterMod, afterModValue, buttons, entryPoint, entryPointLoc,
    } = this._context;
    const { type, target, original } = event;

    if (target.name === entryPoint && original.location.equals(entryPointLoc) && type === 'leave') {
      this._rule.abort();
      return [];
    }

    if (
      target.name === block
      && type === 'enter'
      && (!mod || !modValue || (target.mods[mod] && target.mods[mod] === modValue))
    ) {
      buttons.push(target);
      return [];
    }

    if (
      target.name === after
      && type === 'enter'
      && (!mod || !modValue || (target.mods[afterMod] && target.mods[afterMod] === afterModValue))
    ) {
      this._rule.changeState('listening');
      this._context.buttons = [];
      return buttons.map((entity) => this._rule.generateError({ entity }));
    }

    return [];
  }
}
