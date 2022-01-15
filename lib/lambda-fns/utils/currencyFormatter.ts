
type CurrencyLocaleData = { format: string; currency: string}
type Currency = { [country: string]: CurrencyLocaleData }

const currencies: Currency = {
  us: {
    format: 'en-US',
    currency: 'USD'
  },
  china: {
    format: 'zh-CN',
    currency: 'CNY'
  },
  canada: {
    format: 'en-CA',
    currency: 'CAD'
  }
}

const newCurrencyFormatter = (currencyCountry: string): Intl.NumberFormat => {
  
  const {format, currency} = currencies[currencyCountry]

  return new Intl.NumberFormat(format, {
    style: 'currency',
    currency,
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
}

export const usCurrencyFormatter = newCurrencyFormatter('us').format