#!/usr/bin/env bash
# data-flow runner -- branch TS-152 (Node 22, bun, Microservices).
# TypeScript replacement for the former red-dragon driver (Python >= 3.13, uv, a git clone of red-dragon). It uses the
# TypeScript compiler API instead and is a different, flow-insensitive analysis -- see dataflow.ts for the differences.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"
mkdir -p reports
node_modules/.bin/ts-node "Tool Triggering (Synthetic Data)/red-dragon/dataflow.ts" reports/dataflow.json \
  packages/domain/src/analysis/call-graph-sample.ts packages/domain/src/analysis/complexity-sample.ts packages/domain/src/analysis/taint-fixture.ts packages/domain/src/analysis/dead-code.ts
