import Operations from './operations';
import UserStream from './user-stream';

class OperationsManager {
  private oparations: Operations;

  private userStream: UserStream;

  public constructor() {
    this.oparations = new Operations();
    this.userStream = new UserStream();
  }

  get currentDirectory(): string {
    return this.oparations.directory;
  }

  public async define(data: string | Buffer): Promise<void> {
    const inputData = data.toString('utf-8').trim().split(' ');
    const event = inputData[0];

    if (event === '.exit') {
      process.exit(0);
    }

    switch (event) {
      case 'up':
        this.oparations.up();
        break;
      case 'cd':
        await this.oparations.cd(inputData.slice(1));
        break;
      case 'ls':
        await this.oparations.ls();
        break;
      default:
        this.userStream.showError();
        break;
    }
  }
}

export default OperationsManager;
