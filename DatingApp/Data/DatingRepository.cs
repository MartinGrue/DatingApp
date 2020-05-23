using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Helpers;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            this._context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes
            .FirstOrDefaultAsync(u => u.LikerID == userId && u.GeliketerID == recipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userid)
        {
            return await _context.Photos.Where(u => u.UserId == userid).FirstOrDefaultAsync(p => p.isMain);
        }

        public async Task<Message> GetMessage(int id)
        {
            //used for CreatedAtRoute at messageController
            return await _context.Messages.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
            .Include(u => u.Sender).ThenInclude(p => p.Photos)
            .Include(u => u.Recipient).ThenInclude(p => p.Photos)
            .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserID
                    && u.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserID
                    && u.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.UserID 
                    && u.IsRead == false 
                    && u.RecipientDeleted == false);
                    break;
            }

            messages = messages.OrderByDescending(o => o.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .Where(m => m.RecipientId == userId && m.RecipientDeleted == false
                && m.SenderId == recipientId
                || m.RecipientId == recipientId && m.SenderDeleted == false && m.SenderId == userId )
                .OrderByDescending(m => m.MessageSent).ToArrayAsync();

            return messages;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != userParams.userID).Where(u => u.Gender == userParams.Gender);

            if (userParams.ILiked)
            {

                var userILiked = await GetUserLikes(userParams.userID, userParams.ILiked);
                users = users.Where(u => userILiked.Contains(u.Id));
            }

            if (userParams.UsersThatLikedMe)
            {
                var userGelikte = await GetUserLikes(userParams.userID, userParams.ILiked);
                users = users.Where(u => userGelikte.Contains(u.Id));

            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDateOfBirth = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDateOfBirth = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDateOfBirth && u.DateOfBirth <= maxDateOfBirth);
            }
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers_or_gelikte)
        {
            var user = await _context.Users
            .Include(x => x.Likers)
            .Include(x => x.Geliketers)
            .FirstOrDefaultAsync(u => u.Id == id);

            if (likers_or_gelikte)
            {

                return user.Likers.Where(u => u.LikerID == id).Select(i => i.GeliketerID);

            }
            else
            {
                return user.Geliketers.Where(u => u.GeliketerID == id).Select(i => i.LikerID);
            }
        }
    }
}