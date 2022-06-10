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
    console.log(
      `Welcome to the File Manager, ${this.userStream.userName}!`,
      '\n Print commands and wait for results:',
    );

    this.processData();
    this.handleAppExit();
  }

  private processData(): void {
    process.stdout.write('>');
    process.stdin.once('data', (data) => {
      this.operationManager.define(data);
      if (!this.isClosed) this.processData();
    });
  }

  private handleAppExit(): void {
    process.on('SIGINT', () => {
      process.exit(0);
    });
    process.on('exit', () => {
      this.isClosed = true;
      console.log(
        `Thank you for using File Manager, ${this.userStream.userName}!`,
      );
    });
  }
}

export default App;
