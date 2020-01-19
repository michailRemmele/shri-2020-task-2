import { BemEntity } from 'src/bemEntityBuilder/bemEntityBuilder';
import { Context } from '../rule';

export default interface OrderValidationRuleContext extends Context {
  after: string;
  buttons?: BemEntity[];
}
