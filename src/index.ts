import { Error } from 'src/rules/rule';
import Linter from './linter/linter';

import linterRules from './linterRules.json';

const linter = new Linter(linterRules);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function lint(json: string): Error[] {
  return linter.lint(json);
}
