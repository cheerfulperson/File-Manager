import { homedir } from 'os';

class Operations {
  public directory: string = homedir();

  public up(): void {
    console.log(this.directory);
  }
}

export default Operations;
