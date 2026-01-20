import { useState, useEffect } from "react";
import type { Concern, ConcernUrgency, ConcernStatus } from "../types/Concern";
import {
  URGENCY_OPTIONS,
  URGENCY_LABELS,
  STATUS_OPTIONS,
} from "../types/Concern";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { DateTimePicker } from "./DateTimePicker";
import "./ConcernForm.css";

// Detailed status options based on status
const DETAILED_STATUS_OPTIONS: Record<string, string[]> = {
  Preparing: [
    "Pending",
    "For Starting",
    "For Designing",
    "For Canvassing",
    "For Quotation",
    "For Demo",
    "Delayed",
    "For Presentation",
  ],
  Ongoing: [
    "Pending",
    "For Starting",
    "In Progress",
    "Delayed",
    "For Problem Solving",
    "For Finishing",
  ],
};

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
  onDelete?: (id: string) => void;
  initialValues?: Partial<Concern>;
}

export function ConcernForm({
  onSubmit,
  onCancel,
  onDelete,
  initialValues,
}: ConcernFormProps) {
  const { user } = useAuth();
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
  const [to, setTo] = useState(initialValues?.to ?? "");

  // Check if detailed status is required
  const requiresDetailedStatus = status === "Preparing" || status === "Ongoing";
  const detailedStatusOptions = DETAILED_STATUS_OPTIONS[status] || [];

  // Check if 'to' field is required
  const requiresTo = status === "For Delegating" || status === "For Download";

  // Clear detailed status when status changes to one that doesn't need it
  useEffect(() => {
    if (!requiresDetailedStatus) {
      setDetailedStatus("");
    }
    // Clear 'to' field when status changes to one that doesn't need it
    if (!requiresTo) {
      setTo("");
    }
  }, [status, requiresDetailedStatus, requiresTo]);

  // Fetch groups and profiles for dropdowns, and current user's profile
  useEffect(() => {
    const fetchData = async () => {
      const [groupsResult, profilesResult, currentUserResult] =
        await Promise.all([
          supabase
            .from("groups")
            .select("code, name")
            .order("weight", { ascending: true }),
          supabase
            .from("profiles")
            .select("nickname")
            .order("nickname", { ascending: true }),
          user
            ? supabase
                .from("profiles")
                .select("nickname")
                .eq("user_id", user.id)
                .single()
            : Promise.resolve({ data: null, error: null }),
        ]);

      if (groupsResult.data) setGroups(groupsResult.data);
      if (profilesResult.data) {
        // Filter out empty nicknames
        setProfiles(profilesResult.data.filter((p) => p.nickname));
      }
      if (currentUserResult.data && !currentUserResult.error) {
        // Set defaults only if this is a new concern (no initialValues)
        if (!initialValues) {
          if (currentUserResult.data.nickname) {
            setPic(currentUserResult.data.nickname);
          }
        }
      }
    };
    fetchData();
  }, [user, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim() || !groupCode) return;
    if (!pic) return; // PIC is required
    if (!status) return; // Status is required
    if (!startDate) return; // Start Date is required
    if (requiresDetailedStatus && !detailedStatus) return;
    if (requiresTo && !to) return; // 'to' is required for delegating/download

    onSubmit({
      groupCode,
      urgency,
      task: task.trim().slice(0, 100),
      startDate: new Date(startDate),
      remarks: remarks.trim(),
      status,
      detailedStatus: detailedStatus.trim(),
      pic,
      to: to.trim(),
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
      setTo("");
    }
  };

  return (
    <form className="concern-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Urgency</label>
        <div className="urgency-toggle-group">
          {URGENCY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`urgency-toggle ${opt === urgency ? "active" : ""} urgency-${opt.toLowerCase().replace(" ", "-")}`}
              onClick={() => setUrgency(opt)}
            >
              {URGENCY_LABELS[opt]}
            </button>
          ))}
        </div>
      </div>

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
          <label htmlFor="pic">PIC (Person in Charge) *</label>
          <select
            id="pic"
            value={pic}
            onChange={(e) => setPic(e.target.value)}
            required
          >
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
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ConcernStatus)}
            required
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {requiresTo && (
          <div className="form-group">
            <label htmlFor="to">To *</label>
            <select
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required={requiresTo}
            >
              <option value="">Select Person</option>
              {profiles.map((profile) => (
                <option key={profile.nickname} value={profile.nickname}>
                  {profile.nickname}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="detailedStatus">
            Detailed Status{requiresDetailedStatus && " *"}
          </label>
          {requiresDetailedStatus ? (
            <select
              id="detailedStatus"
              value={detailedStatus}
              onChange={(e) => setDetailedStatus(e.target.value)}
              required
            >
              <option value="">Select Detailed Status</option>
              {detailedStatusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="detailedStatus"
              type="text"
              value={detailedStatus}
              disabled
              placeholder="N/A"
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date *</label>
          <DateTimePicker
            id="startDate"
            value={startDate}
            onChange={setStartDate}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <DateTimePicker
            id="endDate"
            value=""
            onChange={() => {}}
            disabled
            placeholder="Auto-set when completed"
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
        {initialValues?.id && onDelete && (
          <button
            type="button"
            className="btn btn-delete"
            onClick={() => onDelete(initialValues.id as string)}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
