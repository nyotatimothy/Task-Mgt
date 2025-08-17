import React from "react";
import { TaskItem } from "../types/task";

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priorityColors = {
    1: "#28a745", // green
    2: "#6c757d", // gray
    3: "#ffc107", // yellow
    4: "#fd7e14", // orange
    5: "#dc3545", // red
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "12px",
        marginBottom: "10px",
        backgroundColor: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <h4
          style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "bold" }}
        >
          {task.title}
        </h4>
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => onEdit(task)}
            style={{
              border: "none",
              background: "#007bff",
              color: "white",
              borderRadius: "3px",
              padding: "2px 6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={{
              border: "none",
              background: "#dc3545",
              color: "white",
              borderRadius: "3px",
              padding: "2px 6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {task.description && (
        <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666" }}>
          {task.description}
        </p>
      )}

      <div style={{ fontSize: "11px", color: "#888" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            Priority:
            <span
              style={{
                marginLeft: "5px",
                padding: "2px 6px",
                borderRadius: "10px",
                backgroundColor:
                  priorityColors[task.priority as keyof typeof priorityColors],
                color: "white",
                fontWeight: "bold",
              }}
            >
              {task.priority}
            </span>
          </span>
          {task.assigneeName && <span>Assigned: {task.assigneeName}</span>}
        </div>
        <div style={{ marginTop: "5px" }}>Created by {task.creatorName}</div>
      </div>
    </div>
  );
}
