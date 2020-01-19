import { Event } from 'src/treeExplorer/treeExplorer';
import Location from 'src/location';
import Rule from '../index';
import Context from '../context';
import { Error } from '../../rule';

describe('Mod equality check rule', () => {
  const location = new Location({
    start: { line: 1, column: 10, offset: 12 },
    end: { line: 10, column: 2, offset: 45 },
    source: null,
  });

  const context: Context = {
    entryPoint: 'warning',
    entryPointLoc: location,
    block: 'text',
    errorCode: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
    errorText: 'Texts sizes in warning block should be equals',
    mod: 'size',
    modValues: ['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', 'xxxxl', 'xxxxxl'],
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

  it('Should pass without errors: no text', () => {
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

  it('Should pass without errors: all text\'s sizes are equal', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'text', 'size', 's'),
      getEvent('leave', 'text', 'size', 's'),
      getEvent('enter', 'text', 'size', 's'),
      getEvent('leave', 'text', 'size', 's'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should pass without errors: text after warning', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'text', 'size', 's'),
      getEvent('leave', 'text', 'size', 's'),
      getEvent('leave', 'warning'),
      getEvent('enter', 'text', 'size', 'l'),
      getEvent('leave', 'text', 'size', 'l'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: text\'s size is undefined', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'text'),
      getEvent('leave', 'text'),
      getEvent('leave', 'warning'),
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [
      {
        code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
        error: 'Texts sizes in warning block should be equals',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: text\'s sizes aren\'t equal', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'text', 'size', 's'),
      getEvent('leave', 'text', 'size', 's'),
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
        code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
        error: 'Texts sizes in warning block should be equals',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: multiple invalid texts', () => {
    const rule = new Rule(context);

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'text', 'size', 's'),
      getEvent('leave', 'text', 'size', 's'),
      getEvent('enter', 'text', 'size', 'l'),
      getEvent('leave', 'text', 'size', 'l'),
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
        code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
        error: 'Texts sizes in warning block should be equals',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: nested warnings', () => {
    const rule = new Rule(context);

    const nestedWarnLoc = new Location({
      start: { line: 4, column: 10, offset: 12 },
      end: { line: 8, column: 2, offset: 45 },
      source: null,
    });

    const events: Event[] = [
      getEvent('enter', 'warning'),
      getEvent('enter', 'text', 'size', 's'),
      getEvent('leave', 'text', 'size', 's'),
      getEvent('enter', 'warning', null, null, nestedWarnLoc),
      getEvent('enter', 'text', 'size', 's'),
      getEvent('leave', 'text', 'size', 's'),
      getEvent('leave', 'warning', null, null, nestedWarnLoc),
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
        code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
        error: 'Texts sizes in warning block should be equals',
        location,
      },
    ];

    expect(errors).toEqual(expectedResult);
  });
});
