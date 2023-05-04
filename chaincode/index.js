'use strict';

const { Contract } = require('fabric-contract-api');

class VoteChaincode extends Contract {

    async initLedger(ctx) {
        console.info('Initializing Ledger');
    }

    // Cast a vote
    async castVote(ctx, voterHash, votedHash) {
        await ctx.stub.putState(voterHash, Buffer.from(votedHash));
        console.info(`Vote has been cast by voter_hash: ${voterHash}`);
    }

    // Get all votes
    async getAllVotes(ctx) {
        const startKey = '';
        const endKey = '';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const votes = [];
        let result = await iterator.next();

        while (!result.done) {
            const keyValue = { voter_hash: result.value.key.toString(), voted_hash: result.value.value.toString() };
            votes.push(keyValue);
            result = await iterator.next();
        }

        await iterator.close();
        return JSON.stringify(votes);
    }

    // Get a single vote
    async getVote(ctx, voterHash) {
        const votedHashBytes = await ctx.stub.getState(voterHash);
        if (!votedHashBytes || votedHashBytes.length === 0) {
            throw new Error(`No vote found for voter_hash: ${voterHash}`);
        }

        return votedHashBytes.toString();
    }

}

module.exports = VoteChaincode;
