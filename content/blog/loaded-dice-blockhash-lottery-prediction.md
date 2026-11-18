---
slug: "loaded-dice-blockhash-lottery-prediction"
title: "Loaded Dice: predicting a lottery that called itself fair"
date: "2026-10-07"
category: "ctf"
tags:
  - "CTF"
  - "Web3"
  - "Smart Contracts"
  - "Randomness"
  - "31 Nights of Cyber"
excerpt: "The draw mixed the parent block hash with a timestamp. Both were known before the draw transaction was mined, so the winner was public information."
---

![Loaded Dice — block data as a randomness source](/images/blog/loaded-dice-blockhash-lottery-prediction/hero.png)

"Provably fair" is three words that should make you open the contract. Not because provable fairness is impossible — it is not — but because the phrase is often used to describe a formula that is provable and *not* fair.

Here, a lottery's winner was correctly predicted by a third party before the draw transaction was even mined. We get the contract source, the entrant list, and the block data recovered from node logs. The job is to reconstruct the winner-selection formula offline and predict it ourselves.

## The draw function

```solidity
function draw() external {
    require(!drawn, "already drawn");
    require(msg.sender == owner, "only owner draws");

    lastDifficultyObserved = block.prevrandao;

    uint256 idx = uint256(
        keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
    ) % entrants.length;

    winningIndex = idx;
    winner = entrants[idx];
    drawn = true;

    emit Drawn(winner, idx);
}
```

That `prevrandao` line is doing a lot of emotional work. It *looks* like entropy — it is the post-merge replacement for `difficulty`, and it is often described as a source of randomness. But read the next line: it is stored and never used. It is the decoy.

The actual selection mixes two values:

| Input | Value | Predictable before mining? |
|---|---|---|
| `blockhash(block.number - 1)` | hash of block `18999999` | **Yes** — the parent block is already mined |
| `block.timestamp` | `1735000000` | **Yes** — in the logs, and miner-influenceable |

There is no commit-reveal, no future block hash, no VRF, no secret. As soon as the parent block exists, anyone can compute the index. The "third party" in the story did not break anything. They read public data.

![Reconstructing the draw offline](/images/blog/loaded-dice-blockhash-lottery-prediction/flow.png)

## Recompute the index

The block data:

```json
{
  "drawBlockNumber": 19000000,
  "parentBlockNumber": 18999999,
  "parentBlockHash": "0xbd14e98d019d0e4471775d86f8c6f2b36eb94c59edd5e2e9e005b503e58e97be",
  "drawTimestamp": 1735000000
}
```

`abi.encodePacked(bytes32, uint256)` is exactly `parentHash || uint256(timestamp)` — 32 bytes plus 32 bytes, big-endian. Using a small pure-Python Keccak implementation:

```python
from keccak import keccak256

parent = bytes.fromhex("bd14e98d019d0e4471775d86f8c6f2b36eb94c59edd5e2e9e005b503e58e97be")
ts = (1735000000).to_bytes(32, "big")

h = keccak256(parent + ts)
idx = int.from_bytes(h, "big") % 8

print(h.hex())   # c31d1da5b1017a5730ce6f861ca6f9ede8b9a3ba4a3fd4ed5218ba9e4040bce2
print(idx)       # 2
```

The entrant list is synthetic — `0x1000...0001` through `0x1000...0008` — so:

```
entrants[2] = 0x1000000000000000000000000000000000000003
```

The platform wanted the derived value only, lowercase hex, no `0x` prefix:

```
r00t{1000000000000000000000000000000000000003}
```

## Why block data is not randomness

This is a well-trodden path in smart-contract security, so let me be precise about *why* each input fails:

- **`blockhash(block.number - 1)`** is fixed before the draw transaction is included. Every node knows it. There is no uncertainty left to exploit.
- **`block.timestamp`** is chosen by the block proposer within a tolerance window, and it is visible in the block. Even if it were not miner-controlled, it is not secret.
- **`block.prevrandao`** (formerly `difficulty`) is a beacon value mixed into the block, but it is public by the time the block is executed. Using it *within the same transaction* gives you no secrecy. Using it for a future block requires a commit-reveal structure with incentives, not a single call.
- **`block.number`**, **`msg.sender`**, **`gasleft()`** — all public or predictable. None of them are entropy.

The fix is a verifiable randomness beacon. [Chainlink VRF](https://docs.chain.link/vrf) is the standard answer: the randomness is generated off-chain, committed on-chain, and verifiable against the request. It costs LINK, which is why people try to avoid it — and then build a lottery with `blockhash`.

The other legitimate pattern is commit-reveal with a delay and a bond: users commit hashes, then reveal after a future block, and the contract penalises non-revealers. It is more work than a VRF and easier to get wrong, but it does not depend on an oracle.

## The decoy

`lastDifficultyObserved` is a red herring in the classic sense: it is written, it is stored, and it is never read by the selection formula. The challenge even comments on it in the source. If you build your mental model by grepping for "rand", you will fixate on it. If you read the draw function line by line, you will see it is inert.

I have started doing this deliberately: before analysing a contract, write down the *data flow* — what is written, what is read, what is used in a decision. Storage writes that never feed a read are either bookkeeping or bait.

## What I would check in a real audit

- **Where does the randomness come from?** If the answer is anything in the block header, the answer is "not randomness".
- **Who can influence it?** Miners/proposers can influence timestamps and ordering. Users can influence `msg.sender`, gas, and transaction timing.
- **When is it revealed?** If the value is known before the outcome is committed, it is not a secret.
- **What is the economic incentive?** A lottery with a $10 jackpot can tolerate weak randomness. A lottery with $10M cannot.
- **Is there a commit-reveal?** If yes, check the bond, the reveal window, and what happens to non-revealers.

## Further reading

- [Chainlink VRF documentation](https://docs.chain.link/vrf)
- [Solidity docs — randomness and block values](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#block-and-transaction-properties)
- [Ethereum post-merge `PREVRANDAO` (EIP-4399)](https://eips.ethereum.org/EIPS/eip-4399)
- [SWC-120 — Weak Sources of Randomness from Chain Attributes](https://swcregistry.io/docs/SWC-120)

Day eight: a vault that lost its entire balance in one transaction, including funds from users who never withdrew.
