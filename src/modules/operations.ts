import { homedir } from 'os';
import { join, resolve } from 'path';
import { stat, readdir } from 'fs/promises';
import UserStream from './user-stream';

class Operations {
  public directory: string = homedir();

  private userStream: UserStream = new UserStream();

  public up(): void {
    if (this.directory === join(this.directory, '..')) {
      this.userStream.showError(
        "Operation failed: operation can't change working directory",
      );
    }
    this.directory = join(this.directory, '..');
  }

  public async cd(argv: string[]): Promise<void> {
    const newPath = resolve(this.directory, argv[0]);
    try {
      const value = await stat(newPath);
      if (value.isDirectory()) {
        this.directory = newPath;
      } else {
        throw new Error('no directory');
      }
    } catch (error) {
      this.userStream.showError(
        'Operation failed:',
        `no such directory ${newPath}`,
      );
    }
  }

  public async ls(): Promise<void> {
    try {
      const filesInFolder: string[] = await readdir(this.directory);
      console.log(filesInFolder);
      filesInFolder.forEach(async (filePath: string) => {
        const fileInfo = await stat(join(this.directory, filePath));

        console.log(
          `[\x1b[32m${fileInfo.isFile() ? 'file' : 'dir '}\x1b[0m]`,
          filePath,
          `${fileInfo.size}kb`,
          fileInfo.birthtime,
        );
      });
    } catch (error) {
      this.userStream.showError('Operation failed:');
    }
  }
}

export default Operations;
