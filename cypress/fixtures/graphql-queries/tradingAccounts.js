export const tradingAccounts = `
query tradingAccounts($walletAddress:String! ){  
  tradingAccounts(wallet_address: $walletAddress) {
    trading_account_id
	}
}`;