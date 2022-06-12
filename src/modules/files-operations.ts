import { rename, copyFile, rm } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { dirname, resolve } from 'path';
import { createHmac } from 'crypto';
import Operations from './operations';
import BrotliCompress from './brotli-comress';

class FilesOperations extends Operations {
  private brotliCompress: BrotliCompress = new BrotliCompress();

  public constructor() {
    super();
  }

  public async readFile(argv: string[], hasInfo = true): Promise<string> {
    const pathToFile: string = resolve(
      this.directory,
      this.getFolderName(argv),
    );

    return new Promise((res, rej) => {
      const readStream = createReadStream(pathToFile, 'utf-8');
      let data = '';
      readStream.on('data', (chunk) => {
        data += chunk.toString('utf-8');
      });
      readStream.on('end', () => {
        if (hasInfo) {
          this.userStream.showInfo('[\x1b[36minfo\x1b[0m]\n', data);
        }
        res(data);
      });
      readStream.on('error', (err) => {
        this.printError(pathToFile);
        rej(err);
      });
    });
  }

  public async addFile(argv: string[]): Promise<void> {
    const pathToFile = resolve(this.directory, this.getFolderName(argv));
    return new Promise((res, rej) => {
      const writeStream = createWriteStream(pathToFile, { encoding: 'utf8' });
      writeStream.on('close', () => {
        this.userStream.showInfo(
          '[\x1b[36minfo\x1b[0m]',
          `An empty file was created in ${this.directory}`,
        );
        res();
      });
      writeStream.on('error', () => {
        this.printError(pathToFile);
        rej();
      });
      writeStream.end('');
      writeStream.close();
    });
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
      this.printError(pathToFile);
    }
  }

  public async copyFile(argv: string[], isMove = false): Promise<void> {
    const userArgv = this.getArguments(argv);
    const pathToFile = resolve(this.directory, userArgv[0] || '');
    const newFilePath = resolve(this.directory, userArgv[1] || '');

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
      this.printError(pathToFile);
    }
  }

  public async removeFile(argv: string[], hasPrint = false): Promise<void> {
    const pathToFile = resolve(this.directory, this.getFolderName(argv));

    try {
      await rm(pathToFile);

      if (hasPrint) {
        this.userStream.showInfo(
          '[\x1b[36minfo\x1b[0m]',
          `A file was removed from ${pathToFile}`,
        );
      }
    } catch (error) {
      this.printError(pathToFile);
    }
  }

  public async printHash(argv: string[]): Promise<void> {
    const pathToFile = resolve(this.directory, this.getFolderName(argv));
    try {
      const fileText: string = await this.readFile(argv, false);

      const hash = createHmac('sha256', 'secret')
        .update(fileText)
        .digest('hex');
      this.userStream.showInfo(
        '[\x1b[36minfo\x1b[0m]',
        `Calculated hash for file: ${hash}`,
      );
    } catch (error) {
      this.printError(pathToFile);
    }
  }

  public async compress(argv: string[]): Promise<void> {
    const userArgv = this.getArguments(argv);
    const pathToFile = resolve(this.directory, userArgv[0] || '');
    const pathToDest = resolve(this.directory, userArgv[1] || '');

    return this.brotliCompress
      .compress(pathToFile, pathToDest)
      .then((path: string) => {
        this.userStream.showInfo(
          '[\x1b[36minfo\x1b[0m]',
          `A file was compressed to ${path}`,
        );
      })
      .catch(() => {
        this.printError(pathToFile);
      });
  }

  public async decompress(argv: string[]): Promise<void> {
    const userArgv = this.getArguments(argv);
    const pathToFile = resolve(this.directory, userArgv[0] || '');
    const pathToDest = resolve(this.directory, userArgv[1] || '');
    try {
      const path = await this.brotliCompress.decompress(pathToFile, pathToDest);
      this.userStream.showInfo(
        '[\x1b[36minfo\x1b[0m]',
        `A file was decompressed to ${path}`,
      );
    } catch (error) {
      this.printError(pathToFile);
    }
  }

  private printError(path: string): void {
    this.userStream.showError(
      'Operation failed:',
      `no such file or directory ${path}`,
    );
  }

  private getArguments(argv: string[]): string[] {
    if (argv.length === 0) {
      argv.push('');
    }
    return argv.filter((str: string) => str.includes('"'))[0]
      ? argv
          .join(' ')
          .split('"')
          .filter((str: string) => Boolean(str))
      : argv;
  }
}

export default FilesOperations;
