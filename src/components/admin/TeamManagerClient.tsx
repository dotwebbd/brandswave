"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users2,
  Plus,
  Trash2,
  Edit,
  Phone,
  Mail,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/ToastContext";
import {
  createTeamMemberAction,
  updateTeamMemberAction,
  deleteTeamMemberAction,
} from "@/actions/admin-team";

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  photoId: string | null;
  phone: string | null;
  email: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
  showPhone: boolean;
  showEmail: boolean;
  sortOrder: number;
  isPublished: boolean;
}

interface TeamManagerClientProps {
  members: TeamMemberItem[];
}

export function TeamManagerClient({ members }: TeamManagerClientProps) {
  const router = useRouter();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isPublished, setIsPublished] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<TeamMemberItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAdd = () => {
    setEditingMember(null);
    setName("");
    setRole("");
    setPhotoId(null);
    setPhone("");
    setEmail("");
    setFacebook("");
    setLinkedin("");
    setInstagram("");
    setShowPhone(false);
    setShowEmail(false);
    setSortOrder(members.length);
    setIsPublished(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (m: TeamMemberItem) => {
    setEditingMember(m);
    setName(m.name);
    setRole(m.role);
    setPhotoId(m.photoId);
    setPhone(m.phone || "");
    setEmail(m.email || "");
    setFacebook(m.facebook || "");
    setLinkedin(m.linkedin || "");
    setInstagram(m.instagram || "");
    setShowPhone(m.showPhone);
    setShowEmail(m.showEmail);
    setSortOrder(m.sortOrder);
    setIsPublished(m.isPublished);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!role.trim()) {
      setFormError("Role is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: name.trim(),
        role: role.trim(),
        photoId,
        phone: phone.trim() || null,
        email: email.trim() || null,
        facebook: facebook.trim() || null,
        linkedin: linkedin.trim() || null,
        instagram: instagram.trim() || null,
        showPhone,
        showEmail,
        sortOrder: Number(sortOrder) || 0,
        isPublished,
      };

      const res = editingMember
        ? await updateTeamMemberAction(editingMember.id, payload)
        : await createTeamMemberAction(payload);

      if (res.success) {
        toast.success(res.message || "Team member saved.");
        setModalOpen(false);
        router.refresh();
      } else {
        setFormError(res.error);
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to save team member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await deleteTeamMemberAction(deleteTarget.id);
      if (res.success) {
        toast.success(res.message || "Team member deleted.");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to delete team member.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foam flex items-center gap-2.5">
            <Users2 className="h-7 w-7 text-glass" />
            Executive & Creative Team ({members.length})
          </h1>
          <p className="text-xs sm:text-sm text-foam/60 mt-1">
            Manage agency directors, producers, and creative heads. Toggle public visibility per field.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="btn-primary py-2.5 px-4 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {/* Team Members List */}
      <div className="rounded-2xl border border-foam/15 bg-tide/40 overflow-hidden">
        {members.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users2 className="h-10 w-10 text-foam/30 mx-auto" />
            <p className="text-base font-semibold text-foam">No team members added yet</p>
            <p className="text-xs text-foam/60">
              Add your agency founders, creative directors, and casting managers.
            </p>
            <button
              type="button"
              onClick={openAdd}
              className="btn-primary inline-flex items-center gap-1.5 text-xs py-2 px-4 mt-2"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First Member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foam">
              <thead className="border-b border-foam/10 bg-abyss/40 text-[11px] font-semibold uppercase tracking-wider text-foam/60">
                <tr>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Contact Displays</th>
                  <th className="py-3.5 px-4">Social Links</th>
                  <th className="py-3.5 px-4 text-center">Order</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foam/10">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-swell/20 transition-colors">
                    {/* Photo + Name + Role */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-abyss border border-foam/10">
                          {m.photoId ? (
                            <Image
                              src={`/api/images/${m.photoId}`}
                              alt={m.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs font-bold text-foam/40">
                              {m.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foam block">{m.name}</span>
                          <span className="text-xs text-foam/60 block">{m.role}</span>
                        </div>
                      </div>
                    </td>

                    {/* Display switches preview */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-foam/40" />
                          <span className={m.showPhone && m.phone ? "text-glass font-medium" : "text-foam/40"}>
                            {m.phone ? (m.showPhone ? `Public: ${m.phone}` : "Hidden (Admin only)") : "None"}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-foam/40" />
                          <span className={m.showEmail && m.email ? "text-glass font-medium" : "text-foam/40"}>
                            {m.email ? (m.showEmail ? `Public: ${m.email}` : "Hidden (Admin only)") : "None"}
                          </span>
                        </span>
                      </div>
                    </td>

                    {/* Socials */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-foam/50">
                        {m.facebook && <Facebook className="h-3.5 w-3.5 text-blue-400" />}
                        {m.linkedin && <Linkedin className="h-3.5 w-3.5 text-sky-400" />}
                        {m.instagram && <Instagram className="h-3.5 w-3.5 text-pink-400" />}
                        {!m.facebook && !m.linkedin && !m.instagram && (
                          <span className="text-xs text-foam/30">—</span>
                        )}
                      </div>
                    </td>

                    {/* Sort Order */}
                    <td className="py-3 px-4 text-center text-xs font-mono text-foam/70">
                      {m.sortOrder}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          m.isPublished
                            ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                            : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                        }`}
                      >
                        {m.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(m)}
                          className="rounded-lg p-1.5 text-foam/60 hover:bg-swell/50 hover:text-foam"
                          title="Edit member"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m)}
                          className="rounded-lg p-1.5 text-red-400/80 hover:bg-red-500/20 hover:text-red-300"
                          title="Delete member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-abyss/80 backdrop-blur-sm"
            onClick={() => !isSubmitting && setModalOpen(false)}
          />

          <form
            onSubmit={handleSave}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-foam/15 bg-tide p-6 shadow-2xl z-10 space-y-5"
          >
            <h3 className="text-lg font-semibold text-foam">
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shakib Al Hasan"
                    className="input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Role / Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Managing Director & Producer"
                    className="input"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="pt-1">
                <ImageUploadField
                  label="Profile Portrait"
                  value={photoId}
                  onChange={(id) => setPhotoId(id)}
                  aspectRatio="square"
                  helperText="Square headshot. Auto-compressed WebP."
                />
              </div>

              {/* Phone with public visibility toggle */}
              <div className="rounded-xl border border-foam/15 bg-abyss/30 p-3.5 space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-glass" />
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1700 000000"
                    className="input py-2 text-xs"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={showPhone}
                    onChange={(e) => setShowPhone(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-foam/30 text-glass focus:ring-glass bg-abyss"
                  />
                  <span className="text-xs font-medium text-foam/70">
                    Display phone number publicly on the About/Team page
                  </span>
                </label>
              </div>

              {/* Email with public visibility toggle */}
              <div className="rounded-xl border border-foam/15 bg-abyss/30 p-3.5 space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-glass" />
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="member@brandswave.com"
                    className="input py-2 text-xs"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={showEmail}
                    onChange={(e) => setShowEmail(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-foam/30 text-glass focus:ring-glass bg-abyss"
                  />
                  <span className="text-xs font-medium text-foam/70">
                    Display email address publicly on the About/Team page
                  </span>
                </label>
              </div>

              {/* Social Links */}
              <div className="space-y-2.5 pt-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-foam/80 block">
                  Social Media Links (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="url"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="Facebook URL"
                    className="input py-2 text-xs"
                  />
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="LinkedIn URL"
                    className="input py-2 text-xs"
                  />
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Instagram URL"
                    className="input py-2 text-xs"
                  />
                </div>
              </div>

              {/* Order & Publish */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foam/80">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="input"
                  />
                  <span className="text-[11px] text-foam/40">Lower numbers appear first</span>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="h-4 w-4 rounded border-foam/30 text-glass focus:ring-glass bg-abyss"
                    />
                    <span className="text-sm font-medium text-foam">Published to site</span>
                  </label>
                </div>
              </div>

              {formError && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-foam/10">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-foam/20 px-4 py-2 text-sm text-foam hover:bg-swell/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary py-2 px-5 text-sm"
              >
                {isSubmitting ? "Saving Member…" : editingMember ? "Update Member" : "Add Member"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Team Member?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? Their profile and picture will be removed.`}
        confirmLabel="Delete Member"
        isLoading={isDeleting}
      />
    </div>
  );
}
