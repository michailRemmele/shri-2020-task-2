import { Error } from 'src/rules/rule';
import Linter from './linter/linter';

import linterRules from './linterRules.json';

const linter = new Linter(linterRules);

globalThis.lint = function lint(json: string): Error[] {
  return linter.lint(json);
};
