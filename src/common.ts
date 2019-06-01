export enum Emulator {
  Unknown = 0,
  ZSNES,
  Snes9x
}

export interface IId666 {
  /**
   * Song title
   */
  title: string;

  /**
   * Game title
   */
  game: string;

  /**
   * Name of SPC dumper
   */
  dumpedBy: string;

  /**
   * SPC comments
   */
  comments: string;

  /**
   * Date SPC was dumped
   */
  dumpedOn: Date;

  /**
   * Length of song in seconds before fadeout
   */
  length: number;

  /**
   * Length of fadeout in milliseconds
   */
  fadeOutLength: number;

  /**
   * Song artist
   */
  artist: string;

  /**
   * "Default channel disables" (?)
   */
  defaultChannelDisabled: boolean;

  /**
   * Emulator used to dump SPC
   */
  emulator: Emulator;

}

export interface ISpc {
  /**
   * Whether this SPC has ID666 metadata
   */
  hasID666Metadata: boolean;

  /**
   * Program counter
   */
  regPC: number;

  /**
   * Accumulator
   */
  regA: number;

  /**
   * X register
   */
  regX: number;

  /**
   * Y register
   */
  regY: number;

  /**
   * Program status word
   */
  regPSW: number;

  /**
   * Lower byte of stack pointer address
   */
  regSP: number;

  /**
   * SPC metadata
   */
  metadata?: IId666;

  /**
   * SPC program data
   */
  programData: Uint8Array;

  /**
   * DSP registers
   */
  dspRegisters: Uint8Array;

  /**
   * IPL RAM
   */
  iplRam: Uint8Array;
}

