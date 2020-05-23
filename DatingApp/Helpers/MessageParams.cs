namespace DatingApp.Helpers
{
    public class MessageParams
    {
            //query string that is send with a request to to messageController
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 20;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }
                //The USerID kann be the id of the Recipient (when MessageContainer=="Inbox") or hte id of the Sender (when MessageContainer =="Outbox")

         // userID ==> recipientID
        public int UserID { get; set; }
        public string MessageContainer { get; set; } = "Unread";

    }
}