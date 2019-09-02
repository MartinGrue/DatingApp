
namespace DatingApp.Models
{
    public class Like
    {
        public int LikerID { get; set; }
        public int GeliketerID { get; set; }
        public User Liker { get; set; }
        public User Geliketer { get; set; }
    }
}