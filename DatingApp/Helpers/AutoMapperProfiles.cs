using System.Linq;
using AutoMapper;
using DatingApp.Dtos;
using DatingApp.Models;

namespace DatingApp.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            //The first arg in <> is the source; the sencond arg in the <> is the destination

            CreateMap<User, UserForListDto>()
            .ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.isMain).Url);
            })
            .ForMember(dest => dest.Age,
            map => map.MapFrom((s, d) => s.DateOfBirth.CalculateAge())
            // ,opt =>
            // {
            //     opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());
            // }
            )
            ;
            CreateMap<User, USerForDetailedDto>().ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.isMain).Url);
            })
            .ForMember(dest => dest.Age,
            map => map.MapFrom((s, d) => s.DateOfBirth.CalculateAge())

            // , opt =>
            // {
            //     opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());
            // }
            )
            ;

            CreateMap<UserForUpdateDto, User>();

            CreateMap<Photo, PhotosForDetailedDto>();
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<Photo, PhotoForReturnDto>();

            CreateMap<UserForRegisterDto, User>();

            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            //this map is used in the getMessage controller method and no MessageForReturnDto is used there.
            //instead MessageForCreationDto is for input and output 

            //The MessageForReturnDto is used for GetMessageForUser coontroller method

            CreateMap<Message, MessageForReturnDto>()
            .ForMember(m => m.SenderPhotoUrl, opt => opt
            .MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.isMain).Url))

            .ForMember(m => m.RecipientPhotoUrl, opt => opt
            .MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.isMain).Url));
        }
    }
}