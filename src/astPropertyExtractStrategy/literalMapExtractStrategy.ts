import { ASTProperty } from 'src/astBuilder/astBuilder';
import ASTPropertyExtractStrategy from './astPropertyExtractStrategy';

export default class LiteralMapExtractStrategy implements ASTPropertyExtractStrategy {
  execute(property: ASTProperty): object {
    if (property.value.type !== 'Object') {
      throw new Error(`Incorrect property value type: ${property.value.type}. Type should be object`);
    }

    return property.value.children.reduce((storage: object, childProp: ASTProperty) => {
      if (childProp.value.type === 'Literal') {
        storage[childProp.key.value] = childProp.value.value;
      }

      return storage;
    }, {});
  }
}
