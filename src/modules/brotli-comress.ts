import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { basename, join, extname } from 'path';

class BrotliCompress {
  private brotliCompress = createBrotliCompress();

  private brotliDecompress = createBrotliDecompress();

  public compress(pathToFile: string, pathToDest: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const writeFilePath = extname(pathToDest)
        ? `${pathToDest}.br`
        : join(pathToDest, `${basename(pathToFile)}.br`);

      const readStream = createReadStream(pathToFile);
      const writeStream = createWriteStream(writeFilePath);

      const stream = readStream.pipe(this.brotliCompress).pipe(writeStream);

      readStream.on('error', (err) => {
        reject(err);
      });
      stream.on('finish', () => {
        resolve(writeFilePath);
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  public decompress(pathToFile: string, pathToDest: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const pathToFileChecked = pathToFile.includes('.br')
        ? pathToFile
        : `${pathToFile}.br`;
      const fileOldName = basename(pathToFileChecked);
      const writeFilePath = extname(pathToDest)
        ? pathToDest
        : join(pathToDest, `${fileOldName.slice(0, fileOldName.length - 3)}`);

        console.log(pathToFileChecked, writeFilePath);
      const readStream = createReadStream(pathToFileChecked);
      const writeStream = createWriteStream(writeFilePath);

      const stream = readStream.pipe(this.brotliDecompress).pipe(writeStream);

      this.brotliDecompress.on('error', (err) => {
        reject(err);
      });
      stream.on('finish', () => {
        resolve(writeFilePath);
      });
      readStream.on('error', (err) => {
        reject(err);
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export default BrotliCompress;
