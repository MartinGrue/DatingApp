using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Helpers;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{

    [Route("api/users/{userId}/[controller]")]
    [ApiController]

    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            this._mapper = mapper;
            this._repo = repo;

        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var messageFromRepo = await _repo.GetMessage(id);
            if (messageFromRepo == null)
            {
                return NotFound();
            }
            return Ok(messageFromRepo);
        }
        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {

            var sender = await _repo.GetUser(userId); //this variavble is not used only init to let automappermagic for the sender url and knownas happen 
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            messageForCreationDto.SenderId = userId;
            var recipientID = await _repo.GetUser(messageForCreationDto.RecipientId);

            if (recipientID == null)
            {
                return BadRequest("Could not find user");
            }
            var message = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add(message);

            if (await _repo.SaveAll())
            {
                var messageToReturn = _mapper.Map<MessageForReturnDto>(message);
                return CreatedAtRoute("GetMessage", new {userId = userId, id = message.Id }, messageToReturn);
            }
            // throw new Exception("Creating the message failed on save");
            return Ok();

        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery]MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            messageParams.UserID = userId;
            var messagesFromRepo = await _repo.GetMessagesForUser(messageParams);

            var messages = _mapper.Map<IEnumerable<MessageForReturnDto>>(messagesFromRepo);


            Response.AddPagination(messagesFromRepo.CurrentPage,
                            messagesFromRepo.PageSize, messagesFromRepo.TotalCount,
                             messagesFromRepo.TotalPages);

            return Ok(messages);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var messageFromRepo = await _repo.GetMessageThread(userId, recipientId);

            var messageThread = _mapper.Map<IEnumerable<MessageForReturnDto>>(messageFromRepo);
            return Ok(messageThread);
        }

        [HttpPost("{id}")]        
        //here POST is used to "delete" a message ant not DELETE because the message only get "deleted"==hide from view for one user
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var messageFromRepo = await _repo.GetMessage(id);
            if(messageFromRepo.SenderId == userId){
                messageFromRepo.SenderDeleted = true;
            }
            if(messageFromRepo.RecipientId == userId){
                messageFromRepo.RecipientDeleted = true;
            }

            if(messageFromRepo.RecipientDeleted == true && messageFromRepo.SenderDeleted == true){
                _repo.Delete(messageFromRepo);
            }
            if(await _repo.SaveAll()){
                return NoContent();
            }
            throw new Exception("Error deleting message");
        }
        [HttpPost("{id}/isread")]
        public async Task<IActionResult> MarkMessageAsRead(int id, int userId){ //IsReadMessage
                        if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var messageFromRepo = await _repo.GetMessage(id);
            if(messageFromRepo.RecipientId != userId){
                return Unauthorized();
            }
            messageFromRepo.IsRead = true;
            messageFromRepo.DateRead = DateTime.Now;

            if(await _repo.SaveAll()){
                return NoContent();
            }
            throw new Exception("Error deleting message");
        }
    }
}