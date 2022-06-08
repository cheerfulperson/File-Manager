import { Args } from '../models/arg.model';

class App {
  public start(): void {
    console.log(
      `Welcome to the File Manager, ${this.getArgByName('username').value}!`,
    );
  }

  private getArgByName(name: string): Args {
    return (
      this.getArgs().find((value: Args) => value.name === name) || {
        name: 'username',
        value: 'username',
      }
    );
  }

  private getArgs(): Args[] {
    const userInputsArgs = process.argv.slice(2);
    return userInputsArgs.reduce<Args[]>((acc, arg) => {
      const argValue: string[] = arg.split('=');
      if (argValue[1] && arg.startsWith('--')) {
        acc.push({
          name: argValue[0].slice(2),
          value: argValue[1],
        });
      }
      return acc;
    }, []);
  }
}

export default App;
