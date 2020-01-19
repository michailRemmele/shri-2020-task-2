import Rule, { Error } from '../rule';
import Context from './context';

import states from './states';
import AccumulationState from './states/accumulationState';

export default class ModGrowthCheckRule extends Rule {
  protected readonly context: Context;
  protected states: object;

  constructor(context: Context) {
    super(context);

    this.context.standard = context.standard;
    this.context.mod = context.mod;
    this.context.modValues = context.modValues;
    this.context.accumulatedDebt = [];
    this.states = states;
    this.state = new AccumulationState(this, this.context);
  }

  generateError(args: any): Error {
    const { entity } = args;

    return {
      code: this.context.errorCode,
      error: this.context.errorText,
      location: entity.location,
    };
  }
}
