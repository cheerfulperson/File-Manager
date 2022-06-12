import {
    EOL,
    cpus,
    CpuInfo,
    homedir,
    arch,
    userInfo,
} from 'os';
import FilesOperations from './files-operations';

class SystemOperations extends FilesOperations {
  public constructor() {
    super();
  }

  public async os(argv: string[]): Promise<void> {
    if (argv.length === 0) {
      this.userStream.showError('Operation failed');
    }

    argv.forEach((arg: string) => {
      const argName: string | null = arg.startsWith('--') ? arg.slice(2) : null;

      switch (argName) {
        case 'EOL':
          this.printEOL();
          break;
        case 'cpus':
          this.printCPUSInfo();
          break;
        case 'homedir':
          this.printHomeDir();
          break;
        case 'username':
          this.printUserName();
          break;
        case 'architecture':
          this.printCPUArchitecture();
          break;
        default:
          this.userStream.showError('Operation failed');
          break;
      }
    });
  }

  private printEOL(): void {
    this.userStream.showInfo(
      '[\x1b[36minfo\x1b[0m]',
      `Default system End-Of-Line is ${JSON.stringify(EOL)}`,
    );
  }

  private printCPUSInfo(): void {
    this.userStream.showInfo(
      '[\x1b[36minfo\x1b[0m]',
      `Amount of CPUS: ${cpus().length}`,
    );
    cpus().forEach((cpu: CpuInfo) => {
      this.userStream.showInfo(
        '[\x1b[36minfo\x1b[0m]',
        `Model: ${cpu.model}; Clock rate: ${cpu.speed}GHz`,
      );
    });
  }

  private printHomeDir(): void {
    this.userStream.showInfo(
      '[\x1b[36minfo\x1b[0m]',
      `Home directory: ${homedir()}`,
    );
  }

  private printUserName(): void {
    this.userStream.showInfo(
      '[\x1b[36minfo\x1b[0m]',
      `System user name: ${userInfo().username}`,
    );
  }

  private printCPUArchitecture(): void {
    this.userStream.showInfo(
      '[\x1b[36minfo\x1b[0m]',
      `CPU architecture: ${arch()}`,
    );
  }
}

export default SystemOperations;
