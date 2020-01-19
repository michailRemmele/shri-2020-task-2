import { BemEntity } from 'src/bemEntityBuilder/bemEntityBuilder';
import { Context } from '../rule';

export default interface ModGrowthCheckRuleContext extends Context {
  standard: string;
  mod: string;
  modValues: string[];
  accumulatedDebt?: BemEntity[];
  standardValueIndex?: number;
}
