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
  mods: RawEntityField;
  mix: RawEntityField;
  content: RawEntityField;
}

interface RawEntity {
  block: string;
  elem: string;
  elemMods: object;
  mods: object;
  mix: BemEntity[];
  content?: ASTObject | ASTArray;
}

export interface BemEntity {
  name: string;
  mods: object;
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
        getValue: (property: ASTProperty): void => this._getString(property),
        default: '',
      },
      elem: {
        getValue: (property: ASTProperty): void => this._getString(property),
        default: '',
      },
      elemMods: {
        getValue: (property: ASTProperty): void => this._getMods(property),
        default: {},
      },
      mods: {
        getValue: (property: ASTProperty): void => this._getMods(property),
        default: {},
      },
      mix: {
        getValue: (property: ASTProperty): void => this._getMix(property),
        default: [],
      },
      content: {
        getValue: (property: ASTProperty): void => this._getAst(property),
      },
    };
  }

  _getString(property: ASTProperty): any {
    return this._extractStrategyMap.literal.execute(property);
  }

  _getMods(property: ASTProperty): any {
    return this._extractStrategyMap.literalMap.execute(property);
  }

  _getMix(property: ASTProperty): any {
    const ast = this._extractStrategyMap.ast.execute(property);

    if (ast.type === 'Object') {
      return [this.build(ast)];
    }
    return ast.children.map((child: ASTObject) => this.build(child));
  }

  _getAst(property: ASTProperty): any {
    return this._extractStrategyMap.ast.execute(property);
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
      mods: this._rawEntityFieldMap.mods.default,
      mix: this._rawEntityFieldMap.mix.default,
    });

    const bemEntity: BemEntity = {
      name: (raw.elem.length) ? `${raw.block}__${raw.elem}` : raw.block,
      mods: (raw.elem.length) ? raw.elemMods : raw.mods,
      mix: raw.mix,
      location: new Location(astObject.loc),
    };

    if (raw.content) {
      bemEntity.content = raw.content;
    }

    return bemEntity;
  }
}
