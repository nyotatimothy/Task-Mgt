using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using backend.DTOs;
using backend.Services;
using backend.Hubs;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly IHubContext<TasksHub> _hubContext;

    public TasksController(ITaskService taskService, IHubContext<TasksHub> hubContext)
    {
        _taskService = taskService;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] string? status = null, [FromQuery] int? assignee = null)
    {
        var tasks = await _taskService.GetTasksAsync(status, assignee);
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(int id)
    {
        var task = await _taskService.GetTaskByIdAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] TaskCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var creatorId = GetCurrentUserId();
        var task = await _taskService.CreateTaskAsync(creatorId, dto);

        // Broadcast task update to all connected clients
        await _hubContext.Clients.All.SendAsync("taskUpdated", task.Id);

        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var callerId = GetCurrentUserId();
            var callerRole = GetCurrentUserRole();
            var task = await _taskService.UpdateTaskAsync(id, callerId, callerRole, dto);

            if (task == null)
            {
                return NotFound();
            }

            // Broadcast task update to all connected clients
            await _hubContext.Clients.All.SendAsync("taskUpdated", id);

            return Ok(task);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Problem(
                statusCode: 403,
                title: "Forbidden",
                detail: ex.Message
            );
        }
        catch (InvalidOperationException ex)
        {
            return Problem(
                statusCode: 400,
                title: "Bad Request",
                detail: ex.Message
            );
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        try
        {
            var callerId = GetCurrentUserId();
            var callerRole = GetCurrentUserRole();
            var deleted = await _taskService.DeleteTaskAsync(id, callerId, callerRole);

            if (!deleted)
            {
                return NotFound();
            }

            // Broadcast task update to all connected clients
            await _hubContext.Clients.All.SendAsync("taskUpdated", id);

            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Problem(
                statusCode: 403,
                title: "Forbidden",
                detail: ex.Message
            );
        }
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token");
        }
        return userId;
    }

    private string GetCurrentUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value ?? "USER";
    }
}
