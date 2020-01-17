import parse, {
  ObjectNode, PropertyNode,
  IdentifierNode, ArrayNode,
  LiteralNode, Location,
  Position,
} from 'json-to-ast';

export type AST = ASTObject | ASTArray | ASTLiteral;

export interface ASTObject extends ObjectNode {
  type: 'Object';
  children: ASTProperty[];
  loc: ASTLocation;
}

export interface ASTProperty extends PropertyNode {
  type: 'Property';
  key: ASTIdentifier;
  value: AST;
  loc: ASTLocation;
}

export interface ASTIdentifier extends IdentifierNode {
  type: 'Identifier';
  value: string;
  raw: string;
}

export interface ASTArray extends ArrayNode {
  type: 'Array';
  children: AST[];
  loc: ASTLocation;
}

export interface ASTLiteral extends LiteralNode {
  type: 'Literal';
  value: string | number | boolean | null;
  raw: string;
  loc: ASTLocation;
}

export interface ASTLocation extends Location {
  start: ASTPosition;
  end: ASTPosition;
}

export interface ASTPosition extends Position {
  line: number;
  column: number;
  offset: number;
}

export default class ASTBuilder {
  build(json: string): AST {
    return parse(json) as AST;
  }
}
