import { ASTLocation } from 'src/astBuilder/astBuilder';
import Location from '../index';

describe('Location', () => {
  it('Should equals', () => {
    const astLocation1: ASTLocation = {
      start: { line: 5, column: 10, offset: 43 },
      end: { line: 8, column: 2, offset: 30 },
      source: null,
    };

    const astLocation2: ASTLocation = {
      start: { line: 5, column: 10, offset: 12 },
      end: { line: 8, column: 2, offset: 45 },
      source: null,
    };

    const location1 = new Location(astLocation1);
    const location2 = new Location(astLocation2);

    expect(location1.equals(location2)).toEqual(true);
  });

  it('Shouldn\'t equals: lines aren\'t equal', () => {
    const astLocation1: ASTLocation = {
      start: { line: 5, column: 10, offset: 43 },
      end: { line: 8, column: 2, offset: 30 },
      source: null,
    };

    const astLocation2: ASTLocation = {
      start: { line: 12, column: 10, offset: 12 },
      end: { line: 52, column: 2, offset: 45 },
      source: null,
    };

    const location1 = new Location(astLocation1);
    const location2 = new Location(astLocation2);

    expect(location1.equals(location2)).toEqual(false);
  });

  it('Shouldn\'t equals: columns aren\'t equal', () => {
    const astLocation1: ASTLocation = {
      start: { line: 5, column: 10, offset: 43 },
      end: { line: 8, column: 2, offset: 30 },
      source: null,
    };

    const astLocation2: ASTLocation = {
      start: { line: 5, column: 15, offset: 12 },
      end: { line: 8, column: 12, offset: 45 },
      source: null,
    };

    const location1 = new Location(astLocation1);
    const location2 = new Location(astLocation2);

    expect(location1.equals(location2)).toEqual(false);
  });

  it('Shouldn\'t equals: lines and columns aren\'t equal', () => {
    const astLocation1: ASTLocation = {
      start: { line: 5, column: 10, offset: 43 },
      end: { line: 8, column: 2, offset: 30 },
      source: null,
    };

    const astLocation2: ASTLocation = {
      start: { line: 15, column: 15, offset: 12 },
      end: { line: 48, column: 12, offset: 45 },
      source: null,
    };

    const location1 = new Location(astLocation1);
    const location2 = new Location(astLocation2);

    expect(location1.equals(location2)).toEqual(false);
  });
});
