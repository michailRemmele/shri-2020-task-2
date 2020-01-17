import { ASTProperty, AST } from 'src/astBuilder/astBuilder';

export default interface ASTPropertyExtractStrategy {
  execute: (property: ASTProperty) => object | string | number | boolean | null | AST;
}
