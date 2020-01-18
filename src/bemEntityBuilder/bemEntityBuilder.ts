import {
  ASTObject, ASTArray, ASTProperty,
} from 'src/astBuilder/astBuilder';
import LiteralExtractStrategy from 'src/astPropertyExtractStrategy/literalExtractStrategy';
import LiteralMapExtractStrategy from 'src/astPropertyExtractStrategy/literalMapExtractStrategy';
import ASTExtractStrategy from 'src/astPropertyExtractStrategy/astExtractStrategy';
import Location from 'src/location';

interface ExtractStrategyMap {
  ast?: ASTExtractStrategy;
  literal?: LiteralExtractStrategy;
  literalMap?: LiteralMapExtractStrategy;
}

interface RawEntityField {
  getValue: (property: ASTProperty) => any;
  default?: any;
}

interface RawEntityFieldMap {
  block: RawEntityField;
  elem: RawEntityField;
  elemMods: RawEntityField;
  mix: RawEntityField;
  content: RawEntityField;
}

interface RawEntity {
  block: string;
  elem: string;
  elemMods: object;
  mix: BemEntity[];
  content?: ASTObject | ASTArray;
}

export interface BemEntity {
  name: string;
  elemMods: object;
  mix: BemEntity[];
  content?: ASTObject | ASTArray;
  location: Location;
}

export default class BemEntityBuilder {
  private _extractStrategyMap: ExtractStrategyMap;
  private _rawEntityFieldMap: RawEntityFieldMap;

  constructor() {
    this._extractStrategyMap = {
      ast: new ASTExtractStrategy(),
      literal: new LiteralExtractStrategy(),
      literalMap: new LiteralMapExtractStrategy(),
    };
    this._rawEntityFieldMap = {
      block: {
        getValue: (property: ASTProperty): any => (
          this._extractStrategyMap.literal.execute(property)
        ),
        default: '',
      },
      elem: {
        getValue: (property: ASTProperty): any => (
          this._extractStrategyMap.literal.execute(property)
        ),
        default: '',
      },
      elemMods: {
        getValue: (property: ASTProperty): any => (
          this._extractStrategyMap.literalMap.execute(property)
        ),
        default: {},
      },
      mix: {
        getValue: (astProperty: ASTProperty): BemEntity[] => {
          const ast = this._extractStrategyMap.ast.execute(astProperty);

          if (ast.type === 'Object') {
            return [this.build(ast)];
          }
          return ast.children.map((child: ASTObject) => this.build(child));
        },
        default: [],
      },
      content: {
        getValue: (property: ASTProperty): any => (
          this._extractStrategyMap.ast.execute(property)
        ),
      },
    };
  }

  build(astObject: ASTObject): BemEntity {
    const raw = astObject.children.reduce((storage: RawEntity, property: ASTProperty) => {
      const field = this._rawEntityFieldMap[property.key.value];

      if (field) {
        storage[property.key.value] = field.getValue(property);
      }

      return storage;
    }, {
      block: this._rawEntityFieldMap.block.default,
      elem: this._rawEntityFieldMap.elem.default,
      elemMods: this._rawEntityFieldMap.elemMods.default,
      mix: this._rawEntityFieldMap.mix.default,
    });

    const bemEntity: BemEntity = {
      name: (raw.elem.length) ? `${raw.block}__${raw.elem}` : raw.block,
      elemMods: raw.elemMods,
      mix: raw.mix,
      location: new Location(astObject.loc),
    };

    if (raw.content) {
      bemEntity.content = raw.content;
    }

    return bemEntity;
  }
}
