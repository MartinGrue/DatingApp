using System;

namespace DatingApp.Dtos
{
    public class PhotoForReturnDto
    {
        public string PublicId { get; set; }
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool isMain { get; set; }
    }
}