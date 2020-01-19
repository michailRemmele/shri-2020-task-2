import { Event } from 'src/treeExplorer/treeExplorer';
import Location from 'src/location';
import Rule from '../index';
import Context from '../context';
import { Error } from '../../rule';

describe('Order validation rule', () => {
  const location = new Location({
    start: { line: 1, column: 10, offset: 12 },
    end: { line: 10, column: 2, offset: 45 },
    source: null,
  });

  const context: Context = {
    entryPoint: 'warning',
    entryPointLoc: location,
    block: 'button',
    after: 'placeholder',
    errorCode: 'WARNING.INVALID_BUTTON_POSITION',
    errorText: 'Button in warning block can\'t be before than placeholder',
  };

  const getEvent = (type, block, loc?): Event => {
    const entity = {
      name: block,
      mods: {},
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

  it('Should pass without errors: button after placeholder', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'placeholder'),
      getEvent('leave', 'placeholder'),
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

  it('Should pass without errors: placeholder after warning', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'button'),
      getEvent('leave', 'button'),
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

  it('Should generate one error: button before placeholder', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'button'),
      getEvent('leave', 'button'),
      getEvent('enter', 'placeholder'),
      getEvent('leave', 'placeholder'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'WARNING.INVALID_BUTTON_POSITION',
        error: 'Button in warning block can\'t be before than placeholder',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: button between two placeholders', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'placeholder'),
      getEvent('leave', 'placeholder'),
      getEvent('enter', 'button'),
      getEvent('leave', 'button'),
      getEvent('enter', 'placeholder'),
      getEvent('leave', 'placeholder'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'WARNING.INVALID_BUTTON_POSITION',
        error: 'Button in warning block can\'t be before than placeholder',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate two errors: multiple buttons before placeholder', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'button'),
      getEvent('leave', 'button'),
      getEvent('enter', 'button'),
      getEvent('leave', 'button'),
      getEvent('enter', 'placeholder'),
      getEvent('leave', 'placeholder'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'WARNING.INVALID_BUTTON_POSITION',
        error: 'Button in warning block can\'t be before than placeholder',
        location,
      },
      {
        code: 'WARNING.INVALID_BUTTON_POSITION',
        error: 'Button in warning block can\'t be before than placeholder',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });
});
