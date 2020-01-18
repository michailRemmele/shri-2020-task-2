import Location from 'src/location';
import { Event } from 'src/treeExplorer/treeExplorer';

export interface Error {
  code: string;
  error: string;
  location: Location;
}

export interface State {
  process: (event: Event) => Error[];
}

export interface Context {
  entryPoint: string;
  entryPointLoc: Location;
  block: string;
  errorCode: string;
  errorText: string;
}

export default abstract class Rule {
  private _isAborted: boolean;

  protected context: Context;
  protected state: State;

  protected abstract states: object;

  constructor(context: Context) {
    this.context = context;
    this._isAborted = false;
  }

  changeState(name: string): void {
    if (!this.states[name]) {
      throw new Error(`No state found with this name: ${name}`);
    }

    this.state = new this.states[name](this, this.context);
  }

  generateError(): Error {
    return {
      code: this.context.errorCode,
      error: this.context.errorText,
      location: this.context.entryPointLoc,
    };
  }

  isAborted(): boolean {
    return this._isAborted;
  }

  abort(): void {
    this._isAborted = true;
  }

  process(event: Event): Error[] {
    if (this._isAborted) {
      return [];
    }

    return this.state.process(event);
  }
}
