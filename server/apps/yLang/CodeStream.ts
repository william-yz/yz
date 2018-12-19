
class CodeStream {

  private pos: number = 0;
  private line: number = 1;
  private col: number = 0;

  constructor(private code: string) {
  }

  public peak() {
    return this.code[this.pos];
  }

  public next() {
    const ch = this.code.charAt(this.pos++);

    if (ch === '\n') {
      this.line++;
      this.col = 0;
    } else {
      this.col++;
    }

    return ch;
  }

  public eof() {
    return this.peak() === '';
  }

  public crash() {
    throw new Error();
  }
}