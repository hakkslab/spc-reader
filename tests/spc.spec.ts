import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import Spc from '../src/spc';

describe('Spc tests', () => {
  it('should parse a valid SPC file', () => {
    const data: Buffer = fs.readFileSync(path.resolve(__dirname, 'fixtures/fanfare.spc'));
    const spc = new Spc(data);
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
});
