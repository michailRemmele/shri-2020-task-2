import { ASTLocation } from '../astBuilder/astBuilder';

export interface LocationPoint {
  column: number;
  line: number;
}

export default class Location {
  public readonly start: LocationPoint;
  public readonly end: LocationPoint;

  constructor(astLocation: ASTLocation) {
    this.start = {
      column: astLocation.start.column,
      line: astLocation.start.line,
    };
    this.end = {
      column: astLocation.end.column,
      line: astLocation.end.line,
    };
  }

  _pointEquals(arg1: LocationPoint, arg2: LocationPoint): boolean {
    return arg1.column === arg2.column && arg1.line === arg2.line;
  }

  equals(location: Location): boolean {
    return this._pointEquals(this.start, location.start)
      && this._pointEquals(this.end, location.end);
  }
}
