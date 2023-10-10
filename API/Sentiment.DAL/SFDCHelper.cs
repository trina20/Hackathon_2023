using Newtonsoft.Json;
using Sentiment.DAL.SFDCPartner;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Sentiment.DAL
{
    public class SFDCHelper
    {
        private const string LoginEndpoint = "https://wellsfargo47-dev-ed.develop.my.salesforce.com/services/oauth2/token";

        public string Username { get; set; }
        public string Password { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string InstanceUrl { get; set; }
        public string SecurityToken { get; set; }
        public string InitialToken { get; set; }
        public string ProxyURL { get; set; }
        public string Session { get; set; }
        public string AccessToken { get; set; }
        public string DestinationURL { get; set; }

        SforceService binding;

        public SFDCHelper()
        {
            Username = ConfigurationManager.AppSettings["Username"];
            Password = ConfigurationManager.AppSettings["Password"];
            ClientId = ConfigurationManager.AppSettings["ClientId"];
            ClientSecret = ConfigurationManager.AppSettings["ClientSecret"];
            SecurityToken = ConfigurationManager.AppSettings["SecurityToken"];
            ProxyURL = ConfigurationManager.AppSettings["ProxyURL"];

            binding = new SforceService();
        }

        public string LoginToSalesforce()
        {
            string objectResponse = "";
            //var result = LoginWithREST();
            var result = LoginWithSOAP();
           
            return result;
        }

        private string LoginWithSOAP()
        {
            try
            {
                SforceService binding = new SforceService();
                //Comment proxy if run outside Wells Fargo network
                //binding.Proxy = new WebProxy(ProxyURL);
                LoginResult lr = binding.login(Username, Password + SecurityToken);
                binding.Url = lr.serverUrl;
                Session = lr.sessionId;
                DestinationURL = lr.serverUrl;
            }
            catch (Exception ex)
            {
                return "fail" + ex.Message;
            }
            return "success";
        }

        public string CreateRecord(string custName, string email, string feedbackText, string feedbackEnquiry, string phone, string analysisValue)
        {
            string result = "";
            try
            {
                binding.Url = DestinationURL;

                binding.SessionHeaderValue = new SessionHeader()
                {
                    sessionId = Session
                };

                sObject sentiment = new sObject();
                XmlElement[] sentimentFields = new XmlElement[6];

                XmlDocument doc = new XmlDocument();
                sentimentFields[0] = doc.CreateElement("Analysis_value__c");
                sentimentFields[0].InnerText = analysisValue;
                sentimentFields[1] = doc.CreateElement("Customer_name__c");
                sentimentFields[1].InnerText = custName;
                sentimentFields[2] = doc.CreateElement("Email__c");
                sentimentFields[2].InnerText = email;
                sentimentFields[3] = doc.CreateElement("Phone_No__c");
                sentimentFields[3].InnerText = phone;
                sentimentFields[4] = doc.CreateElement("Feedback_enquiry_On__c");
                sentimentFields[4].InnerText = feedbackEnquiry;
                sentimentFields[5] = doc.CreateElement("Feedback__c");
                sentimentFields[5].InnerText = feedbackText;

                sentiment.type = "sentiment_Analysis__C";
                sentiment.Any = sentimentFields;

                sObject[] sentimentList = new sObject[1];
                sentimentList[0] = sentiment;

                SaveResult[] results = binding.create(sentimentList);

                for (int i = 0; i < results.Length; i++)
                {
                    if (results[i].success)
                    {
                        result =  "Customer feedback data updated to Salesforce: " + results[i].id;
                    }
                    else
                    {
                        for (int j = 0; j < results[i].errors.Length; j++)
                        {
                            Error err = results[i].errors[j];
                            result =  "Failed to update customer feedback data to Salesforce. Error: " + err.statusCode.ToString() + err.message;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return "fail" + ex.Message;
            }
            return result;
        }

        private string LoginWithREST()
        {
            try
            {
                var proxy = new WebProxy
                {
                    Address = new Uri(ProxyURL),
                    BypassProxyOnLocal = false,
                    UseDefaultCredentials = false

                };

                var httpClientHandler = new HttpClientHandler
                {
                    Proxy = proxy
                };

                string jsonResponse;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

                using (var client = new HttpClient(handler: httpClientHandler, disposeHandler: true))
                {
                    var request = new FormUrlEncodedContent(new Dictionary<string, string>{
                    { "grant_type","password"},
                    { "client_id",ClientId},
                    { "client_secret",ClientSecret},
                    { "username",Username},
                    { "password",Password}
                });

                    var response = client.PostAsync(LoginEndpoint, request).Result;
                    jsonResponse = response.Content.ReadAsStringAsync().Result;
                }

                var values = JsonConvert.DeserializeObject<Dictionary<string, string>>(jsonResponse);
                AccessToken = values["access_token"];
                InstanceUrl = values["instance_url"];
            }
            catch (Exception ex)
            {
                return "fail" + ex.Message;
            }
            return "success";
        }
    }
}
