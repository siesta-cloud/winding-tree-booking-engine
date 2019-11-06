using Newtonsoft.Json;
using System.Collections.Generic;
using System.Numerics;

namespace WT.BookingApi
{
    public class TransactionModel
    {
        [JsonProperty("status")]
        public long Status { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("result")]
        public List<Transaction> Result { get; set; }
    }

    public class Transaction
    {
        [JsonProperty("blockNumber")]
        public long BlockNumber { get; set; }

        [JsonProperty("timeStamp")]
        public long Timestamp { get; set; }

        [JsonProperty("hash")]
        public string Hash { get; set; }

        [JsonProperty("nonce")]
        public long Nonce { get; set; }

        [JsonProperty("blockHash")]
        public string BlockHash { get; set; }

        [JsonProperty("transactionIndex")]
        public long TransactionIndex { get; set; }

        [JsonProperty("from")]
        public string From { get; set; }

        [JsonProperty("to")]
        public string To { get; set; }

        [JsonProperty("value")]
        public BigInteger Value { get; set; }

        [JsonProperty("gas")]
        public int Gas { get; set; }

        [JsonProperty("gasPrice")]
        public BigInteger GasPrice { get; set; }

        [JsonProperty("isError")]
        public int IsError { get; set; }

        [JsonProperty("txreceipt_status")]
        public string TxReceipt_Status { get; set; }

        [JsonProperty("input")]
        public string Input { get; set; }

        [JsonProperty("contractAddress")]
        public string ContractAddress { get; set; }

        [JsonProperty("cumulativeGasUsed")]
        public long CumulativeGasUsed { get; set; }

        [JsonProperty("gasUsed")]
        public long GasUsed { get; set; }

        [JsonProperty("confirmations")]
        public long Confirmations { get; set; }
    }
}
