import { Context } from '../rule';

export default interface GroupProportionsCheckRuleContext extends Context {
  group: string[];
  blockSizeMod: string;
  maxAllowedBlockPart: number;
  fraction: string;
  fractionSizeMod: string;
  groupSize?: number;
  fractionSize?: number;
  blockSize?: number;
}
