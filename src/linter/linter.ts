export interface LocationPoint {
  column: number;
  lint: number;
}

export interface Location {
  start: LocationPoint;
  end: LocationPoint;
}

export interface Error {
  code: string;
  error: string;
  location: Location;
}

export default class Linter {
  /*
  * TODO::remove eslint disable when lint function will be done
  */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lint(json: string): Error[] {
    return [];
  }
}
