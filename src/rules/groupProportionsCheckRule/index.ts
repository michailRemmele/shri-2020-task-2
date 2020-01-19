import Rule from '../rule';
import Context from './context';

import states from './states';
import ListeningState from './states/listeningState';

export default class GroupProportionsCheckRule extends Rule {
  protected readonly context: Context;
  protected states: object;

  constructor(context: Context) {
    super(context);

    this.context.group = context.group;
    this.context.blockSizeMod = context.blockSizeMod;
    this.context.maxAllowedBlockPart = context.maxAllowedBlockPart;
    this.context.fraction = context.fraction;
    this.context.fractionSizeMod = context.fractionSizeMod;
    this.context.blockSize = 0;
    this.context.fractionSize = 0;
    this.context.groupSize = 0;
    this.states = states;
    this.state = new ListeningState(this, this.context);
  }
}
