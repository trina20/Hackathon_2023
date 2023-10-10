using Newtonsoft.Json;
using RestSharp;
using Sentiment.DAL;
using SentimentAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace SentimentAPI.Controllers
{
    [RoutePrefix("api/sentiment")]
    [EnableCors(origins: "http://localhost:3000", headers:"*", methods:"*")]
    public class SentimentController : ApiController
    {
        HttpResponseMessage response = new HttpResponseMessage();

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpPost]
        [Route("Customer")]
        public IHttpActionResult AddCustomer([FromBody] CustomerRequest customer)
        {
            CustomerRepository repo = new CustomerRepository();

            Customer obj = new Customer();
            obj.Title = customer.Title;
            obj.FirstName = customer.FirstName;
            obj.LastName = customer.LastName;
            obj.Email = customer.Email;
            obj.Phone = customer.Phone;

            obj.Feedbacks.Add(new Feedback
            {
                Branch = customer.Branch,
                FeedbackOn = customer.FeedbackOn,
                FeedbackType = customer.FeedbackType,
                FeedbackText = customer.FeedbackText,
                StaffServed = customer.StaffServed
            });

            var result = repo.AddCustomerFeedback(obj);

            var sentimentResult = GenerateSentiment(customer.FeedbackText);

            //Send customer data, feedback and geenrated sentiment to Salesforce
            SFDCHelper helper = new SFDCHelper();
            var loginResult = helper.LoginToSalesforce();
            if (!string.IsNullOrEmpty(loginResult) && loginResult == "success")
            {
                result += helper.CreateRecord(customer.FirstName + " " + customer.LastName, customer.Email, customer.FeedbackText, customer.FeedbackOn, customer.Phone, sentimentResult);
            }
            var response = new
            {
                message = result,
                feedback = customer.FeedbackText,
                sentiment = sentimentResult
            };
            return Ok(JsonConvert.SerializeObject(response, Formatting.Indented));
        }

        [HttpPost]
        [Route("Sentiment")]
        public string GenerateSentiment(string feedback)
        {
            string inputJson = "{\"data\":\"" + feedback + "\"}";
            string result = "";

            var client = new RestClient("http://127.0.0.1:5000");
            var request = new RestRequest("predict", Method.Post);
            request.RequestFormat = DataFormat.Json;
            request.AddBody(inputJson);

            RestResponse response = client.Execute(request);
            if(response.IsSuccessful)
            {
                result = response.Content;
            }
            return result;
        }


        
    }
}
