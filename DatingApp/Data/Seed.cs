using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.Dtos;
using DatingApp.Helpers;
using DatingApp.Models;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace DatingApp.Data
{
    public class Seed
    {

        private readonly DataContext _context;
        public IOptions<CloudinarySettings> CloudinarySettings { get; }
        private Cloudinary _cloudinary;
        public Seed(DataContext context, IOptions<CloudinarySettings> cloudinarySettings)
        {
            _context = context;
            CloudinarySettings = cloudinarySettings;
            Account acc = new Account(
               cloudinarySettings.Value.CloudName,
               cloudinarySettings.Value.ApiKey,
               cloudinarySettings.Value.ApiSecret
           );
            _cloudinary = new Cloudinary(acc);
        }


        public Photo GetPhotoFromUrl(string url, bool isMain)
        {
            var uploadResult = new ImageUploadResult();
            if (url.Length > 0)
            {

                try
                {
                    Stream stream = null;
                    HttpWebRequest aRequest = (HttpWebRequest)WebRequest.Create(url);
                    HttpWebResponse aResponse = (HttpWebResponse)aRequest.GetResponse();
                    using (StreamReader sReader = new StreamReader(aResponse.GetResponseStream(), System.Text.Encoding.Default))
                    {
                        stream = sReader.BaseStream;
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription("image", stream),
                            Folder = "DatingApp",
                            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                        };
                        uploadResult = _cloudinary.Upload(uploadParams);
                    }
                    return new Photo
                    {
                        PublicId = uploadResult.PublicId,
                        Url = uploadResult.Uri.ToString(),
                        isMain = isMain

                    };
                }
                catch (Exception e)
                {
                    return new Photo
                    {
                        PublicId = "ohjat7b4subxo1h29ujf",
                        Url = "https://res.cloudinary.com/dvzlb9xco/image/upload/v1574446512/ohjat7b4subxo1h29ujf.jpg",
                        isMain = isMain
                    };
                }

            }
            return new Photo
            {
                PublicId = "ohjat7b4subxo1h29ujf",
                Url = "https://res.cloudinary.com/dvzlb9xco/image/upload/v1574446512/ohjat7b4subxo1h29ujf.jpg",
                isMain = isMain
            };

        }

        public void SeedUsers()
        {
            if (!_context.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedDataUpdate.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach (var user in users)
                {
                    byte[] passwordHash, passwordSalt;
                    CreatePasswordHash("password", out passwordHash, out passwordSalt);
                    user.PasswordHash = passwordHash;
                    user.PasswordSalt = passwordSalt;
                    user.Username = user.Username.ToLower();

                    Random random = new Random();
                    if (user.Gender == "male")
                    {
                        int randomNumber = random.Next(0, 100);
                        string str = "https://randomuser.me/api/portraits/men/" + randomNumber + ".jpg";
                        user.Photos.Add(GetPhotoFromUrl(str, true));
                    }
                    else
                    {
                        int randomNumber = random.Next(0, 100);
                        string str = "https://randomuser.me/api/portraits/women/" + randomNumber + ".jpg";
                        user.Photos.Add(GetPhotoFromUrl(str, true));
                    }
                    for (int i = 0; i < 3; i++)
                    {
                        int randomNumber = random.Next(0, 1000);
                        string str = "https://picsum.photos/id/" + randomNumber + "/400/400.jpg";
                        user.Photos.Add(GetPhotoFromUrl(str, false));
                    }
                    _context.Users.Add(user);
                }
                _context.SaveChanges();
            }
        }
        public void SeedLikes()
        {
            if (!_context.Likes.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedDataUpdate.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach (var user in users)
                {
                    for (int i = 0; i < 10; i++)
                    {
                        var liker = _context.Users.FirstOrDefault(p => p.Username == user.Username);

                        var rand = new Random();
                        var skip = (int)(rand.NextDouble() * _context.Users.Count());
                        var likee = _context.Users.OrderBy(p => p.Id).Skip(skip).Take(1).First();

                        var record = _context.Likes.FirstOrDefault(p => p.LikerID == liker.Id && p.GeliketerID == likee.Id);

                        if (record == null)
                        {
                            var like = new Like()
                            {
                                LikerID = liker.Id,
                                GeliketerID = likee.Id
                            };
                            _context.Likes.Add(like);
                        }
                        _context.SaveChanges();
                    }
                }
            }
        }
        public void SeedMessages()
        {
            if (!_context.Messages.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedDataUpdate.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach (var user in users)
                {
                    for (int i = 0; i < 10; i++)
                    {
                        var Sender = _context.Users.FirstOrDefault(p => p.Username == user.Username);

                        var rand = new Random();
                        var skip = (int)(rand.NextDouble() * _context.Users.Count());
                        var Recipient = _context.Users.OrderBy(p => p.Id).Skip(skip).Take(1).First();

                        var message = new Message()
                        {
                            SenderId = Sender.Id,
                            RecipientId = Recipient.Id,
                            Content = Sender.Introduction,
                            MessageSent = DateTime.Now
                        };
                        _context.Messages.Add(message);
                    }
                }
            }
            _context.SaveChanges();
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}