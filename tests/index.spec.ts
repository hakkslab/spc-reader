import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import Spc from '../src/spc';
import SpcReader from '../src';

const FIXTURE_PATH = path.resolve(__dirname, 'fixtures/fanfare.spc');

describe('index tests', () => {
  let assertSpc: Spc;
  let fileData: Buffer;
  before(() => {
    fileData = fs.readFileSync(FIXTURE_PATH);
    assertSpc = new Spc(fileData);
  });

  it('should create an SPC object from a file path', async () => {
    const createdSpc: Spc = await SpcReader(FIXTURE_PATH);
    expect(createdSpc).to.eql(assertSpc);
  });

  it('should create an SPC object from a buffer', async () => {
    const createdSpc: Spc = await SpcReader(fileData);
    expect(createdSpc).to.eql(assertSpc);
  });
});
