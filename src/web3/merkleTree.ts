import { BigNumber, ethers } from 'ethers';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';

function hashLeaf(amount: BigNumber, account: string) {
	return Buffer.from(
		ethers.utils
			.solidityKeccak256(['uint256', 'address'], [amount, account])
			.slice(2),
		'hex'
	);
}

function leavesToTree(leaves: Buffer[]) {
	return new MerkleTree(leaves, keccak256, { sortPairs: true });
}

export function generateMerkleTree(allocations: {
	[userAddress: string]: number;
}) {
	console.log(JSON.stringify(allocations));
	const leaves = Object.entries(allocations).map((allocation) => {
		return hashLeaf(
			ethers.BigNumber.from(`${allocation[1]}`),
			`${allocation[0]}`
		);
	});

	return leavesToTree(leaves);
}

export function generateProof(
	merkleTree: MerkleTree,
	value: number,
	userPublicAddress: string
) {
	const proof = merkleTree.getHexProof(
		hashLeaf(ethers.BigNumber.from(value), userPublicAddress)
	);
	return proof;
}
