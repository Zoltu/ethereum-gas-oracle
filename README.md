## What
Simple little web server that responds to GET requests with the percent of blocks (out of the last 200) a particular gas price would have gotten you into.

## Build
```bash
docker image build -t gas-price-oracle .
```

## Run
```bash
docker container run -p 1234:80 -e ETHEREUM_URL=http://localhost:8545 zoltu/ethereum-gas-oracle
```
