import { logger } from '../utils/logger';
import { httpClient } from '../utils/httpClient';
import { asyncTryCatch } from '../utils/tryCatch';
import { createDateTimestamp } from '../utils/timestamp'
import { usCurrencyFormatter } from '../utils/currencyFormatter'

/* 
  US Treasury docs are open, no user info req'd.
  Specific National Debt endpoint docs:
    https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny
*/
const usNationalDebtEndpoint = `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny`
const usNationalDebtDateFilter = `?filter=record_date:eq:`
const usNationalDebtRequestProfile = `getNationalDebt`

export const handler = async (event: any, context: any) => {
  logger.defaultMeta = { requestId: context.awsRequestId };

  // combine into US National Treasury API URL
  const presentDate = createDateTimestamp();
  const presentDateUSNationalDebtURL = `${usNationalDebtEndpoint}${usNationalDebtDateFilter}${presentDate}`

  logger.info(`attempting to retrieve US national debt for today's date: ${presentDate}`)

  // retrieve data for execution date from US National Treasury API
  logger.profile(usNationalDebtRequestProfile)
  const [{data: usTreasuryAPIReponse}, requestError] = await asyncTryCatch(httpClient.get(presentDateUSNationalDebtURL));
  logger.profile(usNationalDebtRequestProfile)
  
  if (requestError) {
    const usNationalDebtRequestErrorMessage = requestError.message
    logger.error(`US National debt request error: ${usNationalDebtRequestErrorMessage}`)
    return;
  }

  /* 
    Example response in comments below function
  */
  
  const {data: usTreasuryResponseData} = usTreasuryAPIReponse
  if (
    usTreasuryResponseData &&
    Array.isArray(usTreasuryResponseData) &&
    usTreasuryResponseData.length > 0
  ) {
    const [{ tot_pub_debt_out_amt: totalPublicDebtOutstanding }] = usTreasuryResponseData
    const totalPublicDebtOutstandingFormatted = usCurrencyFormatter(totalPublicDebtOutstanding)
    logger.info(
      `The United States currently has ${totalPublicDebtOutstandingFormatted} total outstanding debt.`
    )
  } else {
    logger.info(`No data received for today, ${presentDate}! Must be a bank holiday...`)
  }

  return;
}

/* 
  Example US Treasury API response

  GET https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?filter=record_date:eq:2005-12-06

{
  "data": [
    {
      "record_date": "2005-12-06",
      "debt_held_public_amt": "4754600281664.05",
      "intragov_hold_amt": "3368110506847.87",
      "tot_pub_debt_out_amt": "8122710788511.92",
      "src_line_nbr": "1",
      "record_fiscal_year": "2006",
      "record_fiscal_quarter": "1",
      "record_calendar_year": "2005",
      "record_calendar_quarter": "4",
      "record_calendar_month": "12",
      "record_calendar_day": "06"
    }
  ],
  "meta": {
    "count": 1,
    "labels": {
      "record_date": "Record Date",
      "debt_held_public_amt": "Debt Held by the Public",
      "intragov_hold_amt": "Intragovernmental Holdings",
      "tot_pub_debt_out_amt": "Total Public Debt Outstanding",
      "src_line_nbr": "Source Line Number",
      "record_fiscal_year": "Fiscal Year",
      "record_fiscal_quarter": "Fiscal Quarter Number",
      "record_calendar_year": "Calendar Year",
      "record_calendar_quarter": "Calendar Quarter Number",
      "record_calendar_month": "Calendar Month Number",
      "record_calendar_day": "Calendar Day Number"
    },
    "dataTypes": {
      "record_date": "DATE",
      "debt_held_public_amt": "CURRENCY",
      "intragov_hold_amt": "CURRENCY",
      "tot_pub_debt_out_amt": "CURRENCY",
      "src_line_nbr": "NUMBER",
      "record_fiscal_year": "YEAR",
      "record_fiscal_quarter": "QUARTER",
      "record_calendar_year": "YEAR",
      "record_calendar_quarter": "QUARTER",
      "record_calendar_month": "MONTH",
      "record_calendar_day": "DAY"
    },
    "dataFormats": {
      "record_date": "YYYY-MM-DD",
      "debt_held_public_amt": "$10.20",
      "intragov_hold_amt": "$10.20",
      "tot_pub_debt_out_amt": "$10.20",
      "src_line_nbr": "10.2",
      "record_fiscal_year": "YYYY",
      "record_fiscal_quarter": "Q",
      "record_calendar_year": "YYYY",
      "record_calendar_quarter": "Q",
      "record_calendar_month": "MM",
      "record_calendar_day": "DD"
    },
    "total-count": 1,
    "total-pages": 1
  },
  "links": {
    "self": "&page%5Bnumber%5D=1&page%5Bsize%5D=100",
    "first": "&page%5Bnumber%5D=1&page%5Bsize%5D=100",
    "prev": null,
    "next": null,
    "last": "&page%5Bnumber%5D=1&page%5Bsize%5D=100"
  }
}

*/