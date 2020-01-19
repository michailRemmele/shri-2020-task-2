import Rule, { Error } from '../rule';
import Context from './context';

import states from './states';
import ValidationState from './states/validationState';

export default class ModValidationRule extends Rule {
  protected readonly context: Context;
  protected states: object;

  constructor(context: Context) {
    super(context);

    this.context.mod = context.mod;
    this.context.allowedModValues = context.allowedModValues;
    this.states = states;
    this.state = new ValidationState(this, this.context);
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
