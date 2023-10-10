using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sentiment.DAL
{
    public class CustomerRepository
    {
        SentimentEntities _context;


        public CustomerRepository()
        {
            _context = new SentimentEntities();
        }

        public string AddCustomerFeedback(Customer customer)
        {
            try
            {
                _context.Customers.Add(customer);
                var result =_context.SaveChanges();
                if (result != null)
                {
                    return "Customer updated!";
                }
                else
                    return "Failed to update customer data.";
            }
            catch(Exception ex)
            {
                return "Failed to update customer data." + ex.Message;
            }
        }

    }
}
