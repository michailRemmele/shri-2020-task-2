import { Context } from '../rule';

export default interface UniquenessCheckRuleContext extends Context {
  mod?: string;
  modValue?: string;
  blockFound?: boolean;
}
