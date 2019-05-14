import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import Spc from '../src/spc';

describe('Spc tests', () => {
  let fileData: Buffer;

  beforeEach(() => {
    fileData = fs.readFileSync(path.resolve(__dirname, 'fixtures/fanfare.spc'));
  });

  afterEach(() => {
    fileData = null;
  });

  it('should parse a valid SPC file', () => {
    const spc = new Spc(fileData);
    expect(spc.hasID666Metadata).to.be.true;
    expect(spc.regPC).to.eq(0x0291, 'program counter failed');
    expect(spc.regA).to.eq(0x02, 'accumulator failed');
    expect(spc.regX).to.eq(0x22, 'X register failed');
    expect(spc.regY).to.eq(0x01, 'Y register failed');
    expect(spc.regPSW).to.eq(0x00, 'program status word failed');
    expect(spc.regSP).to.eq(0x0ff, 'stack pointer failed');

    const spcMockBuffer = Buffer.alloc(0x10000, '10');
    expect(spc.programData).to.eql(spcMockBuffer, 'program data failed');
    const dspMockBuffer = Buffer.alloc(0x80, '01');
    expect(spc.dspRegisters).to.eql(dspMockBuffer, 'DSP registers failed');
  });

  it('should parse the ID666 metadata if the flag is set', () => {
    const spc = new Spc(fileData);
    expect(spc.metadata.title).to.eq('Fanfare', 'title failed');
    expect(spc.metadata.game).to.eq('Final Fantasy 6', 'game title failed');
    expect(spc.metadata.dumpedBy).to.eq('CzarDragon', 'dumper failed');
    expect(spc.metadata.comments).to.eq('Victory', 'comment failed');
    expect(spc.metadata.dumpedOn.getTime()).to.eq(Date.parse('05/13/2019'), 'dumped date failed');
    expect(spc.metadata.length).to.eq(32, 'song length failed');
    expect(spc.metadata.fadeOutLength).to.eq(7000, 'fade out length failed');
    expect(spc.metadata.artist).to.eq('Nobuo Uematsu', 'artist failed');
    expect(spc.metadata.defaultChannelDisabled).to.eq(false, 'default channel disabled failed');
    expect(spc.metadata.emulator).to.eq(48, 'emulator failed');
  });

  it('should not parse the ID666 metadata if the flag is not set', () => {
    // Mark the ID666 section as absent
    fileData[0x23] = 0x27;
    const spc = new Spc(fileData);
    expect(spc.metadata).to.be.undefined;
  });

  it('should throw an error for an invalid SPC', () => {
    expect(() => new Spc(Buffer.from('Sup'))).to.throw('Not a valid SPC file', 'failed to throw error on bad SPC');
  });
});
