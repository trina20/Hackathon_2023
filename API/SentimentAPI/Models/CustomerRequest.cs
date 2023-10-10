using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SentimentAPI.Models
{
    public class CustomerRequest
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string FeedbackType { get; set; }
        public string FeedbackOn { get; set; }
        public string StaffServed { get; set; }
        public string Branch { get; set; }
        public string FeedbackText { get; set; }        
    }
}