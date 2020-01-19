import { Event } from 'src/treeExplorer/treeExplorer';
import Location from 'src/location';
import Rule from '../index';
import Context from '../context';
import { Error } from '../../rule';

describe('Mod validation rule', () => {
  const location = new Location({
    start: { line: 1, column: 10, offset: 12 },
    end: { line: 10, column: 2, offset: 45 },
    source: null,
  });

  const context: Context = {
    entryPoint: 'warning',
    entryPointLoc: location,
    block: 'placeholder',
    mod: 'size',
    allowedModValues: ['s', 'm', 'l'],
    errorCode: 'WARNING.INVALID_PLACEHOLDER_SIZE',
    errorText: 'Allowed sizes of placeholder block in warning block: s, m, l',
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

  it('Should pass without errors: no placeholders', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should pass without errors: placeholder without size', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'placeholder'),
      getEvent('leave', 'placeholder'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should pass without errors: placeholder with allowed size', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'placeholder', 'size', 'l'),
      getEvent('leave', 'placeholder', 'size', 'l'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should pass without errors: placeholder after warning', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('leave', 'warning'),
      getEvent('enter', 'placeholder'),
      getEvent('leave', 'placeholder'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: placeholder with incorrect size', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'placeholder', 'size', 'xl'),
      getEvent('leave', 'placeholder', 'size', 'xl'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'WARNING.INVALID_PLACEHOLDER_SIZE',
        error: 'Allowed sizes of placeholder block in warning block: s, m, l',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate two errors: multiple placeholder with incorrect size', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'placeholder', 'size', 'xs'),
      getEvent('leave', 'placeholder', 'size', 'xs'),
      getEvent('enter', 'placeholder', 'size', 'm'),
      getEvent('leave', 'placeholder', 'size', 'm'),
      getEvent('enter', 'placeholder', 'size', 'xxl'),
      getEvent('leave', 'placeholder', 'size', 'xxl'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'WARNING.INVALID_PLACEHOLDER_SIZE',
        error: 'Allowed sizes of placeholder block in warning block: s, m, l',
        location,
      },
      {
        code: 'WARNING.INVALID_PLACEHOLDER_SIZE',
        error: 'Allowed sizes of placeholder block in warning block: s, m, l',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });
});
