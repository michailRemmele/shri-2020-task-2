import {
  ASTObject, ASTArray, ASTLocation,
} from 'src/astBuilder/astBuilder';

export interface BemEntity {
  name: string;
  content: ASTObject | ASTArray;
  location: ASTLocation;
}

export default class BemEntityBuilder {
  build(astObject: ASTObject): BemEntity {
    return {
      name: '',
      content: astObject,
      location: astObject.loc,
    };
  }
}
