# ChainWhales Algorithm Prototype

Phase 0 deliverable for ChainWhales.io. This package houses the ingestion, filtering, and scoring prototype so we can validate detection accuracy before building the full platform.

## Requirements

- Python 3.10+
- `uv` or `pip`

## Quickstart

```bash
cd /home/basel/Projects/ChainWhales/algorithms
uv pip install -r <(uv pip compile pyproject.toml)
# or: pip install -e .
python -m chainwhales_algo.examples.run_once --config configs/sample_config.yaml
```

### Continuous loop (push alerts into backend)

Make sure your NestJS backend is running on `http://localhost:4000` (or set
`INTERNAL_API_BASE_URL`) and that `BITQUERY_API_KEY` is exported in your shell:

```bash
cd /home/basel/Projects/ChainWhales/algorithms
export BITQUERY_API_KEY="your_bitquery_api_key"
# optional, defaults to http://localhost:4000
export INTERNAL_API_BASE_URL="http://localhost:4000"

python -m chainwhales_algo.examples.run_loop \
  --config configs/sample_config.yaml \
  --interval-seconds 600
```

This will run the accumulation engine every 10 minutes and push any generated
alerts/tokens to the NestJS `/internal/tokens` and `/internal/alerts` endpoints.

## Layout

- `chainwhales_algo/config.py` — typed config and defaults
- `chainwhales_algo/data_sources/bitquery_client.py` — BitQuery GraphQL client wrapper
- `chainwhales_algo/filters.py` — liquidity, holder, and risk filters
- `chainwhales_algo/scoring.py` — 0–100 weighted scoring implementation
- `chainwhales_algo/engine.py` — orchestration for a single run/backtest with optional sinks
- `chainwhales_algo/sinks/internal_api.py` — pushes tokens & alerts into the NestJS `/internal` endpoints
- `chainwhales_algo/examples/` — runnable prototypes with mock data

## Next Steps

- Plug real BitQuery queries into the client
- Run rolling backtests on 30 days of data
- Export results for dashboard seeding or push directly using the internal API sink

