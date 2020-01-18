import { Event } from 'src/treeExplorer/treeExplorer';
import Location from 'src/location';
import Rule from '../index';
import Context from '../context';
import { Error } from '../../rule';

describe('Mod equality check rule', () => {
  it('Should pass without errors: no text', () => {
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
    };

    const rule = new Rule(context);

    const events: Event[] = [
      {
        type: 'enter',
        target: {
          name: 'warning',
          elemMods: {},
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'warning',
          elemMods: {},
          mix: [],
          location,
        },
      },
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should pass without errors: all text\'s sizes are equal', () => {
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
    };

    const rule = new Rule(context);

    const events: Event[] = [
      {
        type: 'enter',
        target: {
          name: 'warning',
          elemMods: {},
          mix: [],
          location,
        },
      },
      {
        type: 'enter',
        target: {
          name: 'text',
          elemMods: {
            size: 's',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'text',
          elemMods: {
            size: 's',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'enter',
        target: {
          name: 'text',
          elemMods: {
            size: 's',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'text',
          elemMods: {
            size: 's',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'warning',
          elemMods: {},
          mix: [],
          location,
        },
      },
    ];

    const errors: Error[] = events.reduce((array: Error[], event: Event) => {
      array = array.concat(rule.process(event));
      return array;
    }, []);

    const expectedResult = [];

    expect(errors).toEqual(expectedResult);
  });

  it('Should generate one error: text\'s size is undefined', () => {
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
    };

    const rule = new Rule(context);

    const events: Event[] = [
      {
        type: 'enter',
        target: {
          name: 'warning',
          elemMods: {},
          mix: [],
          location,
        },
      },
      {
        type: 'enter',
        target: {
          name: 'text',
          elemMods: {},
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'text',
          elemMods: {},
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'warning',
          elemMods: {},
          mix: [],
          location,
        },
      },
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
    };

    const rule = new Rule(context);

    const events: Event[] = [
      {
        type: 'enter',
        target: {
          name: 'warning',
          elemMods: {},
          mix: [],
          location,
        },
      },
      {
        type: 'enter',
        target: {
          name: 'text',
          elemMods: {
            size: 's',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'text',
          elemMods: {
            size: 's',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'enter',
        target: {
          name: 'text',
          elemMods: {
            size: 'l',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'text',
          elemMods: {
            size: 'l',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'warning',
          elemMods: {},
          mix: [],
          location,
        },
      },
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
    };

    const rule = new Rule(context);

    const events: Event[] = [
      {
        type: 'enter',
        target: {
          name: 'warning',
          elemMods: {},
          mix: [],
          location,
        },
      },
      {
        type: 'enter',
        target: {
          name: 'text',
          elemMods: {
            size: 's',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'text',
          elemMods: {
            size: 's',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'enter',
        target: {
          name: 'text',
          elemMods: {
            size: 'l',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'text',
          elemMods: {
            size: 'l',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'enter',
        target: {
          name: 'text',
          elemMods: {
            size: 'l',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'text',
          elemMods: {
            size: 'l',
          },
          mix: [],
          location,
        },
      },
      {
        type: 'leave',
        target: {
          name: 'warning',
          elemMods: {},
          mix: [],
          location,
        },
      },
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
