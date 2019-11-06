using Microsoft.AspNetCore.Mvc;
using Nethereum.Hex.HexConvertors;
using Newtonsoft.Json;
using System;
using RestSharp;
using System.Linq;
using System.Collections.Generic;

namespace WT.BookingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        
        private static List<ReservationModel> _reservationModels;
        private const string _address = "0x66d54A4D5e8A6F4897D4e04602ded629194D78f9";
        private const string _etherscanApiKey = "JV9R7I8HDWY11ED2NMVHDGUXCADYVKNREV";
        private const string _etherscanEndpoint = "https://api-ropsten.etherscan.io/api";

        [HttpPost]
        public ActionResult<ReservationModel> Booking([FromBody] BookingModel bookingModel)
        {
            if (_reservationModels == null)
            {
                _reservationModels = new List<ReservationModel>();
            }

            var reservationModel = new ReservationModel()
            {
                Id = Guid.NewGuid().ToString(),
                Address = _address,
                Price = 0.1m,
                FirstName = bookingModel.FirstName,
                LastName = bookingModel.LastName
            };

            _reservationModels.Add(reservationModel);

            return reservationModel;
        }

        [Route("{id}")]
        [HttpGet]
        public ActionResult<PaymentStatusModel> IsReservationPaid(string id)
        {
            if (!_reservationModels.Any(x => x.Id == id)) return NotFound();

            var client = new RestClient(_etherscanEndpoint);
            var request = new RestRequest(Method.GET);
            request.AddParameter("module", "account");
            request.AddParameter("action", "txlist");
            request.AddParameter("address", _address);
            request.AddParameter("sort", "asc");
            request.AddParameter("apiKey", _etherscanApiKey);
            var response = client.Execute(request);
            var data = JsonConvert.DeserializeObject<TransactionModel>(response.Content);
            var filteredTransactions = data.Result.Where(x => x.Input != "0x");

            foreach (var transaction in filteredTransactions)
            {
                var decoder = new HexUTF8StringConvertor();
                var guid = decoder.ConvertFromHex(transaction.Input).ToLower();
                if (_reservationModels.Any(x => x.Id == guid))
                {
                    return new PaymentStatusModel() { Status = "confirmed" };
                }
            }

            return new PaymentStatusModel() { Status = "pending" };
        }
    }
}