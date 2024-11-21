export const orderBook = `
query orderBook ($market: ID!) {
  orderbook(market: $market) {
    market_id
    sells {
      price
      shares
    }
    buys {
      price
      shares
    }
  }
}`;