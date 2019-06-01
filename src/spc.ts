import { ISpc, IId666 } from './common';

const SPC_HEADER = Buffer.from('SNES-SPC700 Sound File Data v0.30');

/**
 * Reads and cleans a fixed length string from a buffer.
 *
 * @param buffer The buffer to read from
 * @param start Start of the string
 * @param length Length of the string
 * @returns The string read with trailing 0s cleaned up
 */
function readCleanStringFromBuffer(buffer: Buffer, start: number, length: number): string {
  return buffer.slice(start, start + length).toString('utf-8').replace(/\0/g, '');
}

export default class Spc implements ISpc {
  private buffer: Buffer;

  public hasID666Metadata: boolean;
  public regPC: number;
  public regA: number;
  public regX: number;
  public regY: number;
  public regPSW: number;
  public regSP: number;
  public metadata?: IId666;
  public programData: Uint8Array;
  public dspRegisters: Uint8Array;
  public iplRam: Uint8Array;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.parse();
  }

  /**
   * Parses data out of the SPC file
   */
  private parse(): void {
    if (!this.verify()) {
      throw new Error('Not a valid SPC file');
    }

    this.parseSPCInfo();
    if (this.hasID666Metadata) {
      this.parseID666();
    }
    this.programData = this.buffer.slice(0x100, 0x10100);
    this.dspRegisters = this.buffer.slice(0x10100, 0x10180);
    this.iplRam = this.buffer.slice(0x101C0, 0x10200);
  }

  /**
   * Verifies the SPC header
   */
  private verify(): boolean {
    return this.buffer.slice(0, 33).equals(SPC_HEADER) && this.buffer.readUInt16LE(0x21) === 0x1a1a;
  }

  /**
   * Reads SPC file/program info
   */
  private parseSPCInfo(): void {
    this.hasID666Metadata = this.buffer[0x23] === 0x1a;
    this.regPC = this.buffer.readUInt16LE(0x25);
    this.regA = this.buffer[0x27];
    this.regX = this.buffer[0x28];
    this.regY = this.buffer[0x29];
    this.regPSW = this.buffer[0x2a];
    this.regSP = this.buffer[0x2b];
  }

  /**
   * Parse the text ID666 tags
   */
  private parseID666(): void {
    const { buffer } = this;
    this.metadata = {
      title: readCleanStringFromBuffer(buffer, 0x2e, 32),
      game: readCleanStringFromBuffer(buffer, 0x4e, 32),
      dumpedBy: readCleanStringFromBuffer(buffer, 0x6e, 16),
      comments: readCleanStringFromBuffer(buffer, 0x7e, 32),
      dumpedOn: new Date(readCleanStringFromBuffer(buffer, 0x9e, 11)),
      length: Number(readCleanStringFromBuffer(buffer, 0xa9, 3)),
      fadeOutLength: Number(readCleanStringFromBuffer(buffer, 0xac, 4)),
      artist: readCleanStringFromBuffer(buffer, 0xb1, 32),
      defaultChannelDisabled: buffer[0xd1] === 1,
      emulator: buffer[0xd2]
    };
  }
}
