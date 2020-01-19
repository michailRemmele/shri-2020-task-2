import Rule, { Error } from '../rule';
import Context from './context';

import states from './states';
import ListeningState from './states/listeningState';

export default class UniquenessCheckRule extends Rule {
  protected readonly context: Context;
  protected states: object;

  constructor(context: Context) {
    super(context);

    this.context.mod = context.mod;
    this.context.modValue = context.modValue;
    this.context.blockFound = false;
    this.states = states;
    this.state = new ListeningState(this, this.context);
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
