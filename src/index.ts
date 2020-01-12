import Linter from './linter/linter';

const linter = new Linter();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function lint(json: string): string {
  return linter.lint(json);
}
