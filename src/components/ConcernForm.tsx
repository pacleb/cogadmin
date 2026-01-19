import { useState } from "react";
import type { Concern, ConcernPriority } from "../types/Concern";
import "./ConcernForm.css";

interface ConcernFormProps {
  onSubmit: (concern: Omit<Concern, "id" | "createdAt" | "updatedAt">) => void;
  onCancel?: () => void;
  initialValues?: Partial<Concern>;
}

export function ConcernForm({
  onSubmit,
  onCancel,
  initialValues,
}: ConcernFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [priority, setPriority] = useState<ConcernPriority>(
    initialValues?.priority ?? "medium",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status: initialValues?.status ?? "todo",
      priority,
    });

    if (!initialValues) {
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
  };

  return (
    <form className="concern-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter concern title..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter concern description..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as ConcernPriority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialValues ? "Update Concern" : "Add Concern"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
