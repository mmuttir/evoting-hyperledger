"use strict";

const { Contract } = require("fabric-contract-api");

class VoteChaincode extends Contract {
  async initLedger(ctx) {
    return "Successfully initialized ledger";
  }

  // Cast a vote
  async castVote(ctx, voterHash, candidateId) {
    const vote = {
      candidateId,
      timestamp: new Date().toISOString()
    };
    await ctx.stub.putState(voterHash, Buffer.from(JSON.stringify(vote)));
    return JSON.stringify(vote);
  }

  // Get a single vote
  async getVote(ctx, voterHash) {
    const votedHashBytes = await ctx.stub.getState(voterHash);
    if (!votedHashBytes || votedHashBytes.length === 0) {
      throw new Error(`Vote with hash ${voterHash} does not exist`);
    }
    const vote = JSON.parse(votedHashBytes.toString());
    return vote;
  }

  // Get all votes
  async getAllVotes(ctx) {
    const allVotes = [];
    const iterator = await ctx.stub.getStateByRange("", "");

    let result = await iterator.next();
    while (!result.done) {
      const vote = result.value.value.toString("utf8");
      allVotes.push(JSON.parse(vote));
      result = await iterator.next();
    }

    return allVotes;
  }
}

module.exports = VoteChaincode;
