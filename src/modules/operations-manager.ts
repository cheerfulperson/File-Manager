import Operations from './operations';
import UserStream from './user-stream';

class OperationsManager {
  private oparations: Operations;

  private userStream: UserStream;

  public constructor() {
    this.oparations = new Operations();
    this.userStream = new UserStream();
  }

  public define(data: string | Buffer): void {
    const event = data.toString('utf-8').trim();

    if (event === '.exit') {
      process.exit(0);
    }

    switch (event) {
      case 'up':
        this.oparations.up();
        break;

      default:
        this.userStream.showError();
        break;
    }
  }
}

export default OperationsManager;
