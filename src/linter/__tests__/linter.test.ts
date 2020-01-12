import Linter from '../linter';

it('Hello world test', () => {
  const linter = new Linter();
  expect(linter.lint('{}')).toBe('Hello world! JSON: {}');
});
