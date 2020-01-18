import { Context } from '../rule';

export default interface ModEqualityCheckRuleContext extends Context {
  mod: string;
  modValue: string;
}
