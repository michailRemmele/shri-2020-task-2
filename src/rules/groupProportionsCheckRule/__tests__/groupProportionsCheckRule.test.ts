import { Event } from 'src/treeExplorer/treeExplorer';
import Location from 'src/location';
import Rule from '../index';
import Context from '../context';
import { Error } from '../../rule';

describe('Group proportions check rule', () => {
  const location = new Location({
    start: { line: 1, column: 10, offset: 12 },
    end: { line: 10, column: 2, offset: 45 },
    source: null,
  });

  const context: Context = {
    entryPoint: 'grid',
    entryPointLoc: location,
    block: 'grid',
    blockSizeMod: 'm-columns',
    maxAllowedBlockPart: 0.5,
    group: ['commercial', 'offer'],
    fraction: 'grid__fraction',
    fractionSizeMod: 'm-col',
    errorCode: 'GRID.TOO_MUCH_MARKETING_BLOCKS',
    errorText: 'Marketing blocks takes more than half from all grid columns',
  };

  const getEvent = (type, block, mod?, modValue?, loc?): Event => {
    const entity = {
      name: block,
      mods: {
        ...(mod ? { [mod]: modValue } : {}),
      },
      mix: [],
      location: loc || location,
    };

    return {
      type,
      target: entity,
      original: entity,
      isMix: false,
    };
  };

  it('Should pass without errors: no any fraction', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'grid', 'm-columns', '10'),
      getEvent('leave', 'grid', 'm-columns', '10'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should pass without errors: non commercial fraction', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'grid', 'm-columns', '10'),
      getEvent('enter', 'grid__fraction', 'm-col', '8'),
      getEvent('enter', 'payment'),
      getEvent('leave', 'payment'),
      getEvent('leave', 'grid__fraction', 'm-col', '8'),
      getEvent('leave', 'grid', 'm-columns', '10'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should pass without errors: commercial group with allowed size', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'grid', 'm-columns', '10'),
      getEvent('enter', 'grid__fraction', 'm-col', '3'),
      getEvent('enter', 'commercial'),
      getEvent('leave', 'commercial'),
      getEvent('leave', 'grid__fraction', 'm-col', '3'),
      getEvent('enter', 'grid__fraction', 'm-col', '2'),
      getEvent('enter', 'offer'),
      getEvent('leave', 'offer'),
      getEvent('leave', 'grid__fraction', 'm-col', '2'),
      getEvent('leave', 'grid', 'm-columns', '10'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: not allowed commercial group size', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'grid', 'm-columns', '10'),
      getEvent('enter', 'grid__fraction', 'm-col', '3'),
      getEvent('enter', 'commercial'),
      getEvent('leave', 'commercial'),
      getEvent('leave', 'grid__fraction', 'm-col', '3'),
      getEvent('enter', 'grid__fraction', 'm-col', '4'),
      getEvent('enter', 'offer'),
      getEvent('leave', 'offer'),
      getEvent('leave', 'grid__fraction', 'm-col', '4'),
      getEvent('leave', 'grid', 'm-columns', '10'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'GRID.TOO_MUCH_MARKETING_BLOCKS',
        error: 'Marketing blocks takes more than half from all grid columns',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });
});
