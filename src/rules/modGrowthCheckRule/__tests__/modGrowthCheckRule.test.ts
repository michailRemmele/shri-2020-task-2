import { Event } from 'src/treeExplorer/treeExplorer';
import Location from 'src/location';
import Rule from '../index';
import Context from '../context';
import { Error } from '../../rule';

describe('Mod growth check rule', () => {
  const location = new Location({
    start: { line: 1, column: 10, offset: 12 },
    end: { line: 10, column: 2, offset: 45 },
    source: null,
  });

  const context: Context = {
    entryPoint: 'warning',
    entryPointLoc: location,
    block: 'button',
    standard: 'text',
    mod: 'size',
    modValues: ['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', 'xxxxl', 'xxxxxl'],
    errorCode: 'WARNING.INVALID_BUTTON_SIZE',
    errorText: 'Size of button in warning block should be one step larger than standard',
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

  it('Should pass without errors: no buttons', () => {
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

  it('Should pass without errors: all buttons have correct size', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'text', 'size', 's'),
      getEvent('leave', 'text', 'size', 's'),
      getEvent('enter', 'button', 'size', 'm'),
      getEvent('leave', 'button', 'size', 'm'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should pass without errors: button after warning', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'text', 'size', 's'),
      getEvent('leave', 'text', 'size', 's'),
      getEvent('leave', 'warning'),
      getEvent('enter', 'text', 'size', 's'),
      getEvent('leave', 'text', 'size', 's'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should pass without errors: button\'s size is undefined', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'button'),
      getEvent('leave', 'button'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: button\'s size is incorrect', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'button', 'size', 'xxl'),
      getEvent('leave', 'button', 'size', 'xxl'),
      getEvent('enter', 'text', 'size', 'l'),
      getEvent('leave', 'text', 'size', 'l'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'WARNING.INVALID_BUTTON_SIZE',
        error: 'Size of button in warning block should be one step larger than standard',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: one from two buttons is invalid', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'button', 'size', 'xxl'),
      getEvent('leave', 'button', 'size', 'xxl'),
      getEvent('enter', 'text', 'size', 'xl'),
      getEvent('leave', 'text', 'size', 'xl'),
      getEvent('enter', 'button', 'size', 's'),
      getEvent('leave', 'button', 'size', 's'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'WARNING.INVALID_BUTTON_SIZE',
        error: 'Size of button in warning block should be one step larger than standard',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate two errors: multiple invalid buttons', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'button', 'size', 'xxxl'),
      getEvent('leave', 'button', 'size', 'xxxl'),
      getEvent('enter', 'text', 'size', 'xl'),
      getEvent('leave', 'text', 'size', 'xl'),
      getEvent('enter', 'button', 'size', 's'),
      getEvent('leave', 'button', 'size', 's'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'WARNING.INVALID_BUTTON_SIZE',
        error: 'Size of button in warning block should be one step larger than standard',
        location,
      },
      {
        code: 'WARNING.INVALID_BUTTON_SIZE',
        error: 'Size of button in warning block should be one step larger than standard',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });
});
