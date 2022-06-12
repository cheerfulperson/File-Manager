import OperationsManager from '../modules/operations-manager';
import UserStream from '../modules/user-stream';

class App {
  public userStream: UserStream;

  public operationManager: OperationsManager;

  public isClosed = false;

  constructor() {
    this.userStream = new UserStream();
    this.operationManager = new OperationsManager();
  }

  public start(): void {
    this.userStream.showInfo(
      '\n[\x1b[35mattention\x1b[0m]',
      'At the start of the program and after each end',
      'of input/operation current working directory printed',
      'in following way "path_to_working_directory>"',
    );
    console.log(
      `> Welcome to the File Manager, ${this.userStream.userName}!`,
      '\n> Print commands and wait for results:\n',
    );
    this.processData();
    this.handleAppExit();
  }

  private processData(): void {
    process.stdout.write(
      `${this.operationManager.currentDirectory}\x1b[36m>\x1b[0m`,
    );
    process.stdin.once('data', (data) => {
      this.operationManager.define(data).finally(() => {
        if (!this.isClosed) this.processData();
      });
    });
  }

  private handleAppExit(): void {
    process.on('SIGINT', () => {
      process.exit(0);
    });
    process.on('exit', () => {
      this.isClosed = true;
      console.log(
        `\nThank you for using File Manager, ${this.userStream.userName}!\n`,
      );
    });
  }
}

export default App;
