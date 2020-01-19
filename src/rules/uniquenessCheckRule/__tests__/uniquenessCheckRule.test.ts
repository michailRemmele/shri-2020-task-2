import { Event } from 'src/treeExplorer/treeExplorer';
import Location from 'src/location';
import Rule from '../index';
import Context from '../context';
import { Error } from '../../rule';

describe('Uniqueness check rule', () => {
  const location = new Location({
    start: { line: 1, column: 10, offset: 12 },
    end: { line: 10, column: 2, offset: 45 },
    source: null,
  });

  const context: Context = {
    entryPoint: '_root',
    entryPointLoc: location,
    block: 'text',
    mod: 'type',
    modValue: 'h1',
    errorCode: 'TEXT.SEVERAL_H1',
    errorText: 'H1 should be uniqueness',
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

  it('Should pass without errors: no h1', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', '_root'),
      getEvent('leave', '_root'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should pass without errors: single h1', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', '_root'),
      getEvent('enter', 'text', 'type', 'h1'),
      getEvent('leave', 'text', 'type', 'h1'),
      getEvent('enter', 'text'),
      getEvent('leave', 'text'),
      getEvent('enter', 'text', 'type', 'h2'),
      getEvent('leave', 'text', 'type', 'h2'),
      getEvent('leave', '_root'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: two h1', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'text', 'type', 'h1'),
      getEvent('leave', 'text', 'type', 'h1'),
      getEvent('enter', 'text', 'type', 'h1'),
      getEvent('leave', 'text', 'type', 'h1'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'TEXT.SEVERAL_H1',
        error: 'H1 should be uniqueness',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate two errors: three h1', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'text', 'type', 'h1'),
      getEvent('leave', 'text', 'type', 'h1'),
      getEvent('enter', 'text', 'type', 'h1'),
      getEvent('leave', 'text', 'type', 'h1'),
      getEvent('enter', 'text', 'type', 'h1'),
      getEvent('leave', 'text', 'type', 'h1'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'TEXT.SEVERAL_H1',
        error: 'H1 should be uniqueness',
        location,
      },
      {
        code: 'TEXT.SEVERAL_H1',
        error: 'H1 should be uniqueness',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });
});
