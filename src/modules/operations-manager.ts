import SystemOperations from './system-operations';
import UserStream from './user-stream';

class OperationsManager {
  private oparations: SystemOperations;

  private userStream: UserStream;

  public constructor() {
    this.oparations = new SystemOperations();
    this.userStream = new UserStream();
  }

  get currentDirectory(): string {
    return this.oparations.directory;
  }

  public async define(data: string | Buffer): Promise<void> {
    const inputData = data.toString('utf-8').trim().split(' ');
    const event = inputData[0];
    const argv = inputData.slice(1);

    if (event === '.exit') {
      process.exit(0);
    }

    switch (event) {
      case 'up':
        this.oparations.up();
        break;
      case 'cd':
        await this.oparations.cd(argv);
        break;
      case 'ls':
        await this.oparations.ls();
        break;
      case 'os':
        await this.oparations.os(argv);
        break;
      case 'cat':
        await this.oparations.readFile(argv);
        break;
      case 'add':
        await this.oparations.addFile(argv);
        break;
      case 'rn':
        await this.oparations.renameFile(argv);
        break;
      case 'cp':
        await this.oparations.copyFile(argv);
        break;
      case 'mv':
        await this.oparations.copyFile(argv, true);
        break;
      case 'rm':
        await this.oparations.removeFile(argv, true);
        break;
      default:
        this.userStream.showError();
        break;
    }
  }
}

export default OperationsManager;
