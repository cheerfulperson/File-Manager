import { readFile, writeFile, rename, copyFile, rm } from 'fs/promises';
import { dirname, resolve } from 'path';
import Operations from './operations';

class FilesOperations extends Operations {
  public constructor() {
    super();
  }

  public async readFile(argv: string[]): Promise<void> {
    const pathToFile: string = resolve(
      this.directory,
      this.getFolderName(argv),
    );

    try {
      const fileText: string = await readFile(pathToFile, 'utf-8');
      this.userStream.showInfo('[\x1b[36minfo\x1b[0m]\n', fileText);
    } catch (error) {
      this.userStream.showError(
        'Operation failed:',
        `no such file ${pathToFile}`,
      );
    }
  }

  public async addFile(argv: string[]): Promise<void> {
    try {
      await writeFile(resolve(this.directory, this.getFolderName(argv)), '');
      this.userStream.showInfo(
        '[\x1b[36minfo\x1b[0m]',
        `An empty file was created in ${this.directory}`,
      );
    } catch (error) {
      this.userStream.showError('Operation failed');
    }
  }

  public async renameFile(argv: string[]): Promise<void> {
    const userArgv = this.getArguments(argv);
    const pathToFile = resolve(this.directory, userArgv[0]);
    try {
      await rename(pathToFile, resolve(dirname(pathToFile), userArgv[1]));
      this.userStream.showInfo(
        '[\x1b[36minfo\x1b[0m]',
        `A file was renamed in ${userArgv[1]}`,
      );
    } catch (error) {
      this.userStream.showError('Operation failed');
    }
  }

  public async copyFile(argv: string[], isMove = false): Promise<void> {
    const userArgv = this.getArguments(argv);
    const pathToFile = resolve(this.directory, userArgv[0]);
    const newFilePath = resolve(this.directory, userArgv[1]);

    try {
      await copyFile(pathToFile, newFilePath);
      if (isMove) {
        await this.removeFile([userArgv[0]]);
      }
      this.userStream.showInfo(
        '[\x1b[36minfo\x1b[0m]',
        `${pathToFile} was ${!isMove ? 'copied' : 'moved'} to ${newFilePath}`,
      );
    } catch (error) {
      this.userStream.showError(
        'Operation failed:',
        `no such file or directory ${pathToFile}`,
      );
    }
  }

  public async removeFile(argv: string[], hasPrint = false): Promise<void> {
    const pathToFile = resolve(this.directory, this.getFolderName(argv));

    try {
      await rm(pathToFile);

      if(hasPrint) {
        this.userStream.showInfo(
          '[\x1b[36minfo\x1b[0m]',
          `A file was removed from ${pathToFile}`,
        );
      }
    } catch (error) {
      this.userStream.showError(
        'Operation failed:',
        `no such file or directory ${pathToFile}`,
      );
    }
  }

  private getArguments(argv: string[]): string[] {
    return argv.filter((str: string) => str.includes('"'))[0]
      ? argv
          .join(' ')
          .split('"')
          .filter((str: string) => Boolean(str))
      : argv;
  }
}

export default FilesOperations;
