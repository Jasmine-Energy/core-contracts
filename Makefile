-include .env

.PHONY: all test clean deploy-anvil

all: clean install build

clean:
	forge clean

install:
	git submodule update --init --recursive

build:
	forge build

test:
	forge test

anvil:
	anvil --config-out anvil.json

deploy-anvil:
	forge script scripts/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --private-key $$(jq -r '.private_keys[0]' anvil.json) --broadcast --slow
