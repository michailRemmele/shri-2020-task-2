import Rule, { Error } from '../rule';
import Context from './context';

import states from './states';
import ListeningState from './states/listeningState';

export default class OrderValidationRule extends Rule {
  protected readonly context: Context;
  protected states: object;

  constructor(context: Context) {
    super(context);

    this.context.after = context.after;
    this.context.buttons = [];
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
