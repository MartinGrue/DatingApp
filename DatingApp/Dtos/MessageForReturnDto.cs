using System;

namespace DatingApp.Dtos
{
    public class MessageForReturnDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }

        public int RecipientId { get; set; }

        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; }

        //the nameing here is IMPORTANT that Sender/Recipient comes before!!! this help automapper to find the coresponding fiels in the user model
        public string RecipientPhotoUrl { get; set; }
        public string SenderPhotoUrl { get; set; }
        public string SenderKnownAs { get; set; }
        public string RecipientKnownAs { get; set; }
    }
}