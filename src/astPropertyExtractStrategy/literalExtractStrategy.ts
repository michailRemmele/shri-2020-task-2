import { ASTProperty } from 'src/astBuilder/astBuilder';
import ASTPropertyExtractStrategy from './astPropertyExtractStrategy';

export default class LiteralExtractStrategy implements ASTPropertyExtractStrategy {
  execute(property: ASTProperty): string | number | boolean | null {
    if (property.value.type !== 'Literal') {
      throw new Error(`Incorrect property value type: ${property.value.type}. Type should be literal`);
    }

    return property.value.value;
  }
}
