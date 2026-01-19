import { useState, useEffect } from "react";
import type { Concern, ConcernUrgency, ConcernStatus } from "../types/Concern";
import { URGENCY_OPTIONS, STATUS_OPTIONS } from "../types/Concern";
import { supabase } from "../lib/supabase";
import "./ConcernForm.css";

interface Group {
  code: string;
  name: string;
}

interface Profile {
  nickname: string;
}

interface ConcernFormProps {
  onSubmit: (
    concern: Omit<Concern, "id" | "createdAt" | "updatedAt" | "endDate">,
  ) => void;
  onCancel?: () => void;
  initialValues?: Partial<Concern>;
}

export function ConcernForm({
  onSubmit,
  onCancel,
  initialValues,
}: ConcernFormProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [groupCode, setGroupCode] = useState(initialValues?.groupCode ?? "");
  const [urgency, setUrgency] = useState<ConcernUrgency>(
    initialValues?.urgency ?? "Normal",
  );
  const [task, setTask] = useState(initialValues?.task ?? "");
  const [startDate, setStartDate] = useState<string>(
    initialValues?.startDate
      ? new Date(initialValues.startDate).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  );
  const [remarks, setRemarks] = useState(initialValues?.remarks ?? "");
  const [status, setStatus] = useState<ConcernStatus>(
    initialValues?.status ?? "New",
  );
  const [detailedStatus, setDetailedStatus] = useState(
    initialValues?.detailedStatus ?? "",
  );
  const [pic, setPic] = useState(initialValues?.pic ?? "");

  // Fetch groups and profiles for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      const [groupsResult, profilesResult] = await Promise.all([
        supabase
          .from("groups")
          .select("code, name")
          .order("weight", { ascending: true }),
        supabase
          .from("profiles")
          .select("nickname")
          .order("nickname", { ascending: true }),
      ]);

      if (groupsResult.data) setGroups(groupsResult.data);
      if (profilesResult.data) {
        // Filter out empty nicknames
        setProfiles(profilesResult.data.filter((p) => p.nickname));
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim() || !groupCode) return;

    onSubmit({
      groupCode,
      urgency,
      task: task.trim().slice(0, 100),
      startDate: new Date(startDate),
      remarks: remarks.trim(),
      status,
      detailedStatus: detailedStatus.trim(),
      pic,
    });

    if (!initialValues) {
      setGroupCode("");
      setUrgency("Normal");
      setTask("");
      setStartDate(new Date().toISOString().slice(0, 16));
      setRemarks("");
      setStatus("New");
      setDetailedStatus("");
      setPic("");
    }
  };

  return (
    <form className="concern-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="groupCode">Group *</label>
          <select
            id="groupCode"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            required
          >
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group.code} value={group.code}>
                {group.code} - {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="urgency">Urgency</label>
          <select
            id="urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as ConcernUrgency)}
          >
            {URGENCY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="task">
          Task * <span className="char-count">({task.length}/100)</span>
        </label>
        <input
          id="task"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value.slice(0, 100))}
          placeholder="Enter task description..."
          maxLength={100}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pic">PIC (Person in Charge)</label>
          <select id="pic" value={pic} onChange={(e) => setPic(e.target.value)}>
            <option value="">Select PIC</option>
            {profiles.map((profile) => (
              <option key={profile.nickname} value={profile.nickname}>
                {profile.nickname}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="remarks">Remarks</label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter remarks..."
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ConcernStatus)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="detailedStatus">Detailed Status</label>
          <input
            id="detailedStatus"
            type="text"
            value={detailedStatus}
            onChange={(e) => setDetailedStatus(e.target.value)}
            placeholder="Enter detailed status..."
          />
        </div>
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
