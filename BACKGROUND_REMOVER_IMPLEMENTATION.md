# Background Remover Implementation

## Evaluation
- @imgly/background-removal requires ~40MB model download and WebGPU/WASM.
- Cloudflare Workers cannot host ML model inference easily.
- Browser-side inference is feasible but heavy; not implemented to avoid unverified large dependency.

## Status: NOT IMPLEMENTED
- Reported as unavailable rather than faked.
- Proposed architecture: secure API endpoint (Cloudflare Worker) calling a background-removal API, with client upload and result download. Requires API key secret.
