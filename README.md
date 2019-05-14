# SpcReader

SpcReader is a JS library for reading and parsing date from SPC700 files.

## Installation

To install SpcReader into your project:

```bash
npm i --save spc-reader
```

## Usage

SpcReader's default export is an async factory method for parsing SPCs.

```typescript
import SpcReader, { ISpc } from 'spc-reader';

// Read by file path
const mySpc: ISpc = await SpcReader('aquatic-ambiance.spc');

// Read by buffer
const anotherSpc: ISpc = await SpcReader(fs.readFileSync('blargg-stage.spc'));
```

## Public Exports

In addition `SpcReader`, the following items are also exported for public use.

### ISpc

`ISpc` is an interface that describes the parts and data of an SPC file.

Property | Type | Description
-------- | ---- | -----------
hasID666Metadata | `boolean` | Whether the SPC file contains ID666 metadata. This is the SPC equivalent of ID3 tags.
regPC | `number` | The program counter register.
regA | `number` | The accumulator (A) register.
regX | `number` | The X register.
regY | `number` | The Y register.
regPSW | `number` | The program status word register.
regSP | `number` | The lower byte of the stack pointer.
metadata | `IId666?` | Any ID666 metadata available. If there is none, is `undefined`.
programData | `Uint8Array` | The SPC program data. Will always be 65,536 bytes.
dspRegisters | `Uint8Array` | The DSP registers data. Will always be 128 bytes.

### IId666

`IId666` is an interface that describes the various metadata properties of the ID666 tags.

Property | Type | Description
-------- | ---- | -----------
title | `string` | Title of the song.
game | `string` | The name of the game the song is from.
dumpedBy | `string` | The name of the person/program that dumped the SPC.
comments | `string` | Free form comments field.
dumpedOn | `Date` | The date the SPC data was dumped. Not guaranteed to be a real date.
length | `number` | The length of the song in seconds before beginning fade out.
fadeOutLength | `number` | The length of the fade out in milliseconds.
artist | `string` | The name of the song's artist.
defaultChannelDisabled | `boolean` | I honestly don't know...
emulator | `Emulator` | An ID code identifying the emulator that the SPC was dumped from.

### Emulator

`Emulator` is an `enum` defining some of the ID codes for the `emulator` property of the `IId666` interface.

Value | Name
----- | ----
0 | Unknown
1 | ZSNES
2 | Snes9x
