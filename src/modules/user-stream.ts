import { Args } from '../models/arg.model';

class UserStream {
  public userName = 'userName';

  public constructor() {
    this.userName = this.getArgByName('username').value;
  }

  public getArgByName(name: string): Args {
    return (
      this.getArgs().find((value: Args) => value.name === name) || {
        name: 'username',
        value: 'username',
      }
    );
  }

  public showError(err = 'Invalid input'): void {
    console.log('\x1b[31m', err, '\x1b[0m');
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

export default UserStream;
