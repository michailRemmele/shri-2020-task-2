import { ASTArray, ASTObject, ASTProperty } from 'src/astBuilder/astBuilder';
import ASTPropertyExtractStrategy from './astPropertyExtractStrategy';

export default class ASTExtractStrategy implements ASTPropertyExtractStrategy {
  execute(property: ASTProperty): ASTObject | ASTArray {
    if (property.value.type !== 'Object' && property.value.type !== 'Array') {
      throw new Error(`Incorrect property value type: ${property.value.type}. Type should be array or object`);
    }

    return property.value;
  }
}
