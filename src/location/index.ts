import { ASTLocation } from '../astBuilder/astBuilder';

export interface LocationPoint {
  column: number;
  line: number;
}

export default class Location {
  private readonly _start: LocationPoint;
  private readonly _end: LocationPoint;

  constructor(astLocation: ASTLocation) {
    this._start = {
      column: astLocation.start.column,
      line: astLocation.start.line,
    };
    this._end = {
      column: astLocation.end.column,
      line: astLocation.end.line,
    };
  }

  get start(): LocationPoint {
    return this._start;
  }

  get end(): LocationPoint {
    return this._end;
  }

  _pointEquals(arg1: LocationPoint, arg2: LocationPoint): boolean {
    return arg1.column === arg2.column && arg1.line === arg2.line;
  }

  equals(location: Location): boolean {
    return this._pointEquals(this._start, location.start)
      && this._pointEquals(this._end, location.end);
  }
}
