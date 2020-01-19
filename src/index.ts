import { Error } from 'src/rules/rule';
import Linter from './linter/linter';

const linter = new Linter();

function lint(json: string): Error[] {
  return linter.lint(json);
}

export default lint;
