using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }

        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Like>().HasKey(k => new { k.LikerID, k.GeliketerID });

            builder.Entity<Like>().HasOne(u => u.Geliketer)
            .WithMany(u => u.Geliketers)
            .HasForeignKey(u => u.GeliketerID)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>().HasOne(u => u.Liker)
            .WithMany(u => u.Likers)
            .HasForeignKey(u => u.LikerID)
            .OnDelete(DeleteBehavior.Restrict);

            ///
            ///
            builder.Entity<Message>().HasOne(u => u.Sender)
            .WithMany(u => u.MessagesSend)
            .HasForeignKey(u => u.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>().HasOne(u => u.Recipient)
            .WithMany(u => u.MessagesReceived)
            .HasForeignKey(u => u.RecipientId)
            .OnDelete(DeleteBehavior.Restrict);
        }


    }
}