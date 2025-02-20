<script lang="ts">
	import QRCode from 'qrcode-generator';
	import dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';
	import { onMount, getContext } from 'svelte';
	import { getQrCodeUrl, getPayStatus } from '$lib/apis/auths';
	import { user } from '$lib/stores';
	import Spinner from '$lib/components/common/Spinner.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import { toast } from 'svelte-sonner';

	type _rechargeInfoT = {
		amount: number;
		userId: string;
	};

	const i18n = getContext('i18n');
	const dispatch = createEventDispatcher();
	dayjs.extend(localizedFormat);

	export let show = false;
	let loading = false;
	let showQRcode = false;
	let payNo = '';
	let balanceOfAccount = 100;
	let activateAmount = 0;
	let modeOfPayment = 'wechat';
	let timer: any = null;
	let accountList = [
		{ name: '￥ 50', value: 50 },
		{ name: '￥ 100', value: 100 },
		{ name: '￥ 300', value: 300 },
		{ name: '￥ 500', value: 500 },
		{ name: '￥ 1000', value: 1000 },
		{ name: '￥ 2000', value: 2000 },
		{ name: '其他金额', value: 0 }
	];
	let qrHtml: any = null;

	let _rechargeInfo: _rechargeInfoT = {
		amount: 0,
		userId: $user.id
	};
	$: if (!show) {
		showQRcode = false;
		payNo = '';
		loading = false;
		clearInterval(timer);
	}
	const submitHandler = async () => {
		if (_rechargeInfo.amount <= 0 && !isNaN(_rechargeInfo.amount)) {
			return;
		}

		let res = await getQrCodeUrl(_rechargeInfo.amount * 100, _rechargeInfo.userId).catch(
			(error) => {
				toast.error(`${error}`);
				return null;
			}
		);

		if (res) {
			payNo = res.payNo;
			loading = false;
			qrHtml = await generateQRCode(res);
			showQRcode = true;
			timer = setInterval(async () => {
				initiatePayment();
			}, 3000);
		}
	};

	// 生成二维码的函数
	const generateQRCode = (res: any) => {
		const qr = QRCode(0, 'L');
		qr.addData(res.code);
		qr.make();
		return qr.createImgTag(6, 16);
	};

	const initiatePayment = async (isWarning = false) => {
		const isPaymentSuccess = await getPayStatus(payNo).catch((error) => {
			toast.error(`${error}`);
			return null;
		});

		if (isPaymentSuccess.result === '订单未支付' && isWarning) {
			show = false;
			toast.success($i18n.t('Payment failure'));
		} else if (isPaymentSuccess.result === '支付成功') {
			show = false;
			toast.success($i18n.t('Payment success'));
		}
	};

	onMount(() => {
		return () => clearInterval(timer);
	});
</script>

<Modal size="md" bind:show>
	{#if !showQRcode}
		<div>
			<div class="flex justify-between dark:text-gray-300 px-5 py-4">
				<div class="text-lg font-medium self-center">{$i18n.t('Recharge')}</div>
				<button
					class="self-center"
					on:click={() => {
						show = false; // 关闭 Modal
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5"
					>
						<path
							d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
						/>
					</svg>
				</button>
			</div>
			<hr class="dark:border-gray-800" />

			<div class="flex flex-col md:flex-row w-full p-5 md:space-x-4 dark:text-gray-200">
				<div class="flex flex-col w-full sm:flex-row sm:justify-center sm:space-x-6">
					<form
						class="flex flex-col w-full"
						on:submit|preventDefault={() => {
							submitHandler(); // 调用提交处理函数
						}}
					>
						<!-- 账户余额 -->
						<!-- <div class="flex my-3">
							<div class="w-[100px]">{$i18n.t('Balance of account')}</div>
							<div>{balanceOfAccount}</div>
						</div> -->
						<div class="flex my-3">
							<div class="w-[100px]">{$i18n.t('Recharge amount')}</div>
							<div class="flex-1">
								{#each accountList as item}
									<button
										class="mx-2 mb-2 w-[100px] py-[10px] border-solid border-2 {item.value ===
										activateAmount
											? 'border-indigo-600'
											: '#ccc'} cursor-pointer"
										on:click={() => {
											_rechargeInfo.amount = item.value;
											activateAmount = item.value;
										}}
										type="button"
									>
										{item.name}
									</button>
								{/each}
							</div>
						</div>
						<div class="flex my-3">
							<div class="w-[100px]">{$i18n.t('Mode of payment')}</div>
							<button
								class="flex justify-center items-center mx-2 mb-2 w-[100px] py-[10px] border-solid border-2 {modeOfPayment ===
								'wechat'
									? 'border-indigo-600'
									: '#ccc'} cursor-pointer"
								type="button"
								on:click={() => {
									modeOfPayment = 'wechat';
								}}
							>
								<svg
									t="1739944579242"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="10610"
									width="20"
									height="20"
									><path
										d="M404.511405 600.865957c-4.042059 2.043542-8.602935 3.223415-13.447267 3.223415-11.197016 0-20.934798-6.169513-26.045189-15.278985l-1.959631-4.296863-81.56569-178.973184c-0.880043-1.954515-1.430582-4.14746-1.430582-6.285147 0-8.251941 6.686283-14.944364 14.938224-14.944364 3.351328 0 6.441713 1.108241 8.94165 2.966565l96.242971 68.521606c7.037277 4.609994 15.433504 7.305383 24.464181 7.305383 5.40101 0 10.533914-1.00284 15.328104-2.75167l452.645171-201.459315C811.496653 163.274644 677.866167 100.777241 526.648117 100.777241c-247.448742 0-448.035176 167.158091-448.035176 373.361453 0 112.511493 60.353576 213.775828 154.808832 282.214547 7.582699 5.405103 12.537548 14.292518 12.537548 24.325012 0 3.312442-0.712221 6.358825-1.569752 9.515724-7.544837 28.15013-19.62599 73.202209-20.188808 75.314313-0.940418 3.529383-2.416026 7.220449-2.416026 10.917654 0 8.245801 6.692423 14.933107 14.944364 14.933107 3.251044 0 5.89015-1.202385 8.629541-2.7793l98.085946-56.621579c7.377014-4.266164 15.188934-6.89913 23.790846-6.89913 4.577249 0 9.003048 0.703011 13.174044 1.978051 45.75509 13.159718 95.123474 20.476357 146.239666 20.476357 247.438509 0 448.042339-167.162184 448.042339-373.372709 0-62.451354-18.502399-121.275087-51.033303-173.009356L407.778822 598.977957 404.511405 600.865957z"
										fill="#00C800"
										p-id="10611"
									></path></svg
								>
								<span>&nbsp;{$i18n.t('WeChat Pay')}</span>
							</button>
							<!-- <button
								class="flex justify-center items-center mx-2 mb-2 w-[100px] py-[10px] border-solid border-2 {modeOfPayment ===
								'zfb'
									? 'border-indigo-600'
									: '#ccc'} cursor-pointer"
								type="button"
								on:click={() => {
									modeOfPayment = 'zfb';
								}}
							>
								<svg
									t="1739944621497"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="11608"
									width="20"
									height="20"
									><path
										d="M1024.0512 701.0304V196.864A196.9664 196.9664 0 0 0 827.136 0H196.864A196.9664 196.9664 0 0 0 0 196.864v630.272A196.9152 196.9152 0 0 0 196.864 1024h630.272a197.12 197.12 0 0 0 193.8432-162.0992c-52.224-22.6304-278.528-120.32-396.4416-176.64-89.7024 108.6976-183.7056 173.9264-325.3248 173.9264s-236.1856-87.2448-224.8192-194.048c7.4752-70.0416 55.552-184.576 264.2944-164.9664 110.08 10.3424 160.4096 30.8736 250.1632 60.5184 23.1936-42.5984 42.496-89.4464 57.1392-139.264H248.064v-39.424h196.9152V311.1424H204.8V267.776h240.128V165.632s2.1504-15.9744 19.8144-15.9744h98.4576V267.776h256v43.4176h-256V381.952h208.8448a805.9904 805.9904 0 0 1-84.8384 212.6848c60.672 22.016 336.7936 106.3936 336.7936 106.3936zM283.5456 791.6032c-149.6576 0-173.312-94.464-165.376-133.9392 7.8336-39.3216 51.2-90.624 134.4-90.624 95.5904 0 181.248 24.4736 284.0576 74.5472-72.192 94.0032-160.9216 150.016-253.0816 150.016z"
										fill="#009FE8"
										p-id="11609"
									></path></svg
								>
								<span>&nbsp;{$i18n.t('Alipay')}</span>
							</button> -->
						</div>
						<hr class="dark:border-gray-800 my-3 w-full" />
						<!-- {#if activateAmount === 0} -->
						<div class="flex flex-col space-y-1.5">
							<div class="flex flex-col w-full">
								<div class="mb-1 text-xs text-gray-500">
									{$i18n.t('Recharge amount')}
									{#if _rechargeInfo.amount <= 0}
										<span class="text-[#F56C6C]"
											>{$i18n.t('The amount must be greater than 0')}</span
										>
									{/if}
								</div>

								<div class="flex-1">
									<input
										class="w-full rounded py-2 px-4 text-sm dark:text-gray-300 dark:bg-gray-800 outline-none"
										type="number"
										bind:value={_rechargeInfo.amount}
										autocomplete="off"
										required
										step="0.01"
									/>
								</div>
							</div>
						</div>

						<div class="flex justify-end pt-3 text-sm font-medium">
							<button
								class="px-4 py-2 flex items-center justify-center w-24 bg-[#f0ecf5] hover:bg-[#6B3E98] hover:text-[#fff] text-[#000] transition rounded-lg"
								type="submit"
								disabled={loading}
							>
								{#if loading}
									<span><Spinner></Spinner></span>
								{/if}
								{$i18n.t('Confirm')}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{:else}
		<div>
			<div class="flex justify-between dark:text-gray-300 px-5 py-4">
				<div class="text-lg font-medium self-center">{$i18n.t('Recharge')}</div>
				<button
					class="self-center"
					on:click={() => {
						show = false;
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5"
					>
						<path
							d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
						/>
					</svg>
				</button>
			</div>
			<hr class="dark:border-gray-800" />

			<div class="flex flex-col md:flex-row w-full p-5 md:space-x-4 dark:text-gray-200">
				<div class="flex flex-col w-full sm:flex-row sm:justify-center sm:space-x-6">
					<form class="flex flex-col w-full">
						<div class="flex items-center rounded-md py-2 px-4 w-full">
							<div class="self-center mr-5">
								{@html qrHtml}
							</div>

							<div>
								<div class="self-center capitalize font-semibold">{$i18n.t('WeChat Pay')}</div>

								<div class="text-xs text-gray-500">
									<p class="py-[5px]">
										{$i18n.t('Order number')}<span class="text-[#000000] font-semibold text-[14px]"
											>{payNo}</span
										>
									</p>
									<p class="py-[5px]">
										{$i18n.t('Qr code is valid within 10 minutes, please pay in time')}
									</p>
									<p class="py-[5px]">
										{$i18n.t('Transaction amount')}<span
											class="px-[5px] text-[#f7412d] font-semibold text-[20px]"
											>￥{_rechargeInfo.amount}</span
										>{$i18n.t('Please use {{modeOfPayment}} to scan the left QR code for payment', {
											modeOfPayment: modeOfPayment === 'wechat' ? '微信' : '支付宝'
										})}
									</p>
									<p />
								</div>
							</div>
						</div>

						<hr class="dark:border-gray-800 my-3 w-full" />

						<div class="text-right pt-3 text-sm font-medium">
							<button
								class="px-4 py-2 mr-10px bg-[#f0ecf5] hover:bg-[#6B3E98] hover:text-[#fff] text-[#000] transition rounded-lg"
								on:click={() => {
									showQRcode = false;
									loading = false;
								}}
							>
								{$i18n.t('Back')}
							</button>
							<button
								class="px-4 py-2 ml-10px bg-[#f0ecf5] hover:bg-[#6B3E98] hover:text-[#fff] text-[#000] transition rounded-lg"
								on:click={() => {
									initiatePayment(true);
								}}
							>
								{$i18n.t('I have completed the payment')}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
</Modal>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		/* display: none; <- Crashes Chrome on hover */
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}

	.tabs::-webkit-scrollbar {
		display: none; /* for Chrome, Safari and Opera */
	}

	.tabs {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}
</style>
