import { SafeEventEmitterProvider } from '@web3auth/base';

const { abi: campaignAbi } = require('./NewCampaign.json');
const { abi: factoryAbi } = require('./CampaignFactory.json');
const { abi: tokenAbi } = require('./PostmintPointToken.json');

import { ethers } from 'ethers';
require('dotenv').config();

let provider: any;

export const setProvider = (p: SafeEventEmitterProvider) => {
	provider = new ethers.providers.Web3Provider(p);
};

const postmintTokenAddress = '0xD10d57647260EadB678f8671c0d7ab92C7Ee03f4';
const factoryAddress = '0x654Aefa6B7aa9D74a96B8b0b8C4226E6E18fb722';

export interface IWeb3Client {
	claimFromCampaignContract: (
		userAddress: string,
		campaignAddress: string,
		proof: string[],
		rewardAmount: number
	) => Promise<{
		amount?: number;
		budget?: number;
		status: string;
	}>;
	getUserBalance: (userAddress: string) => Promise<number>;
	getTotalSupply: () => Promise<number>;
	createCampaignContract: (
		value: number,
		setContractState: (state: string) => void,
		userPublicAddress?: string
	) => Promise<string | undefined>;
	claimReward: (
		value?: number,
		campaignContractAddress?: string,
		userPublicAddress?: string
	) => Promise<number | undefined>;
	getCampaignBalance: (
		campaignContractAddress?: string,
		userPublicAddress?: string
	) => Promise<number | undefined>;
	doesCampaignHaveRoot: (campaignAddress: string) => Promise<boolean>;
	getContractAllowance: (
		userAddress: string,
		contractAddress: string
	) => Promise<number>;
	addCampaignFunds: (
		value: number,
		campaignAddress: string,
		userAddress: string,
		setContractState?: ((state: string) => void) | undefined
	) => Promise<number>;
}

export function getWeb3Client(
	web3Provider: SafeEventEmitterProvider
): IWeb3Client {
	const provider = new ethers.providers.Web3Provider(web3Provider);

	const claimFromCampaignContract = async (
		userAddress: string,
		campaignAddress: string,
		proof: string[],
		rewardAmount: number
	): Promise<{ amount?: number; budget?: number; status: string }> => {
		console.log(proof);
		const campaignContract = new ethers.Contract(
			campaignAddress,
			campaignAbi,
			provider.getSigner()
		);
		try {
			const tx = await campaignContract.claim(
				userAddress,
				rewardAmount,
				proof
			);
			const receipt = await tx.wait();
			const event = receipt.events.find(
				(event: { event: string }) => event.event === 'Claim'
			);
			const { amount } = event.args;
			const budget = (await campaignContract.budget()).toNumber();
			console.log(budget);
			return {
				amount: parseFloat(BigInt(amount).toString()),
				budget: parseFloat(budget),
				status: 'SUCCESS',
			};
		} catch (e) {
			alert(e);
			return { status: 'FAILED' };
		}
	};

	const getUserBalance = async (userAddress: string): Promise<number> => {
		const postmintToken = new ethers.Contract(
			postmintTokenAddress,
			tokenAbi,
			provider.getSigner()
		);

		const balance = await postmintToken
			.connect(provider.getSigner())
			.balanceOf(userAddress);

		return parseFloat(balance);
	};

	const getTotalSupply = async (): Promise<number> => {
		const postmintToken = new ethers.Contract(
			postmintTokenAddress,
			tokenAbi,
			provider.getSigner()
		);

		const balance = await postmintToken
			.connect(provider.getSigner())
			.totalSupply();

		return parseFloat(balance);
	};

	const getContractAllowance = async (
		userAddress: string,
		contractAddress: string
	): Promise<number> => {
		const postmintToken = new ethers.Contract(
			postmintTokenAddress,
			tokenAbi,
			provider.getSigner()
		);

		const balance = await postmintToken
			.connect(provider.getSigner())
			.allowance(userAddress, contractAddress);

		return parseFloat(balance);
	};

	const doesCampaignHaveRoot = async (
		campaignAddress: string
	): Promise<boolean> => {
		const campaignContract = new ethers.Contract(
			campaignAddress,
			campaignAbi,
			provider.getSigner()
		);

		const root = await campaignContract.merkleRoot();

		return root.indexOf('000000000000') < 0;
	};

	const addCampaignFunds = async (
		value: number,
		campaignAddress: string,
		userAddress: string,
		setContractState?: (state: string) => void
	): Promise<number> => {
		const campaignContract = new ethers.Contract(
			campaignAddress,
			campaignAbi,
			provider.getSigner()
		);

		const postmintToken = new ethers.Contract(
			postmintTokenAddress,
			tokenAbi,
			provider.getSigner()
		);

		setContractState?.('APPROVING FUNDS');

		await postmintToken
			.connect(provider.getSigner())
			.approve(campaignAddress, `${value}`);

		setContractState?.('WAITING FOR ALLOWANCE');
		let hasApproved = false;
		while (!hasApproved) {
			const allowance = await getContractAllowance(
				userAddress,
				campaignAddress
			);
			if (allowance >= value) {
				hasApproved = true;
			} else {
				await new Promise((r) => setTimeout(r, 5000));
			}
		}

		setContractState?.('ADDING FUNDS');

		const tx = await campaignContract
			.addFunds(`${value}`)
			.catch((e: any) => alert(e));
		await tx.wait();
		const balance = await campaignContract.budget();
		return parseFloat(balance);
	};

	const createCampaignContract = async (
		value: number,
		setContractState: (state: string) => void,
		userPublicAddress?: string
	): Promise<string | undefined> => {
		if (
			typeof (window as any).ethereum !== 'undefined' &&
			userPublicAddress
		) {
			setContractState('DEPLOYING');
			try {
				const factoryContract = new ethers.Contract(
					factoryAddress,
					factoryAbi,
					provider.getSigner()
				);

				const tx = await factoryContract.createCampaign(
					postmintTokenAddress
				);
				const receipt = await tx.wait();
				const event = receipt.events.find(
					(event: { event: string }) =>
						event.event === 'NewCampaignEvent'
				);
				const { campaignAddress } = event.args;

				const campaignContract = new ethers.Contract(
					campaignAddress,
					campaignAbi,
					provider.getSigner()
				);
				try {
					await addCampaignFunds(
						value,
						campaignAddress,
						userPublicAddress,
						setContractState
					);
				} catch {
					alert('Failed to add funds! Please try again!');
				}

				return campaignContract.address;
			} catch (e) {
				alert(e);
				return Promise.reject(e);
			}
		} else {
			return Promise.reject('Please install MetaMask');
		}
	};

	const getCampaignBalance = async (
		campaignContractAddress?: string,
		userPublicAddress?: string
	): Promise<number | undefined> => {
		if (
			typeof (window as any).ethereum !== 'undefined' &&
			userPublicAddress &&
			campaignContractAddress
		) {
			const contract = new ethers.Contract(
				campaignContractAddress,
				campaignAbi,
				provider.getSigner()
			);
			const balance = await contract.budget();
			return balance;
		} else {
			return Promise.reject('Please install MetaMask');
		}
	};

	const claimReward = async (
		value?: number,
		campaignContractAddress?: string,
		userPublicAddress?: string
	): Promise<number | undefined> => {
		if (
			typeof (window as any).ethereum !== 'undefined' &&
			userPublicAddress &&
			campaignContractAddress &&
			value
		) {
			const contract = new ethers.Contract(
				campaignContractAddress,
				campaignAbi,
				provider.getSigner()
			);
			await contract.sendReward(userPublicAddress, value);
		} else {
			return Promise.reject('Please install MetaMask');
		}
	};

	return {
		claimFromCampaignContract,
		getUserBalance,
		getTotalSupply,
		createCampaignContract,
		claimReward,
		getCampaignBalance,
		doesCampaignHaveRoot,
		getContractAllowance,
		addCampaignFunds,
	};
}
