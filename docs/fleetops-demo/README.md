# FleetOps Demo Deck

This package contains a presentation-runtime-shell compatible demo deck for **FleetOps AI Command Center**.

## Files
- `src/contracts/fleetops-demo.json` — deck contract
- `src/generated/fleetops/...` — self-contained scene HTML files

## To use
1. Copy the `fleetops-demo.json` contract into your runtime shell `src/contracts/`
2. Copy the `src/generated/fleetops/` folder into your runtime shell `src/generated/`
3. Seed the deck in `src/main.js`:
   ```js
   await seedDeck(store, "./src/contracts/fleetops-demo.json");
   ```
4. Open the app and load the deck

## Story arc
1. Title
2. Current chaos
3. Command center baseline
4. Incident detected
5. AI diagnosis
6. Playbook execution
7. Recovery
8. Operational impact
