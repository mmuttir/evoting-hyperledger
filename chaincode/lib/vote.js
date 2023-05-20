"use strict";

const { Contract } = require("fabric-contract-api");

class VoteChaincode extends Contract {
  async initLedger(ctx) {
    await ctx.stub.putState("Mutti", "Sample");
    return "Successfully initialized ledger";
  }

  // Cast a vote
  async castVote(ctx, voterHash, votedHash) {
    await ctx.stub.putState(voterHash, votedHash);
    return votedHash;
  }

  // Get a single vote
  async getVote(ctx, voterHash) {
    const votedHashBytes = await ctx.stub.getState(voterHash);

    return votedHashBytes.toString();
  }
}

module.exports = VoteChaincode;
