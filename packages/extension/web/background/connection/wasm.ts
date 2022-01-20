import * as ix from '../../wasm/pkg/noiseexplorer_ix_wasm.js';
import wasm_base64 from '../../wasm/pkg/noiseexplorer_ix_wasm_bg.wasm';

const mime = 'data:application/wasm;base64,'

export async function load_wasm() {
  await (ix as any).default(mime + wasm_base64);
}

export * from '../../wasm/pkg/noiseexplorer_ix_wasm.js';