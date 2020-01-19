import { Context } from '../rule';

export default interface ModValidationRuleContext extends Context {
  mod: string;
  allowedModValues: string[];
}
