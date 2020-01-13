import Linter, { Error } from './linter/linter';

const linter = new Linter();

function lint(json: string): Error[] {
  return linter.lint(json);
}

export default lint;
