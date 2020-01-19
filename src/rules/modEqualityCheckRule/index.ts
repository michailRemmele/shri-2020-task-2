import Rule from '../rule';
import Context from './context';

import states from './states';
import ListeningState from './states/listeningState';

export default class ModEqualityCheckRule extends Rule {
  protected readonly context: Context;
  protected states: object;

  constructor(context: Context) {
    super(context);

    this.context.mod = context.mod;
    this.states = states;
    this.state = new ListeningState(this, this.context);
  }
}
