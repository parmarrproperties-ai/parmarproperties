import { useEffect, useState, useCallback, useRef} from"react";
import { useParams, useNavigate, Link} from"react-router-dom";
import {
 DndContext,
 closestCenter,
 PointerSensor,
 KeyboardSensor,
 useSensor,
 useSensors,
 type DragEndEvent,
} from"@dnd-kit/core";
import {
 arrayMove,
 SortableContext,
 sortableKeyboardCoordinates,
 useSortable,
 verticalListSortingStrategy,
} from"@dnd-kit/sortable";
import { CSS} from"@dnd-kit/utilities";
import { supabase} from"@/lib/supabase";
import { fetchPostBySlugAdmin, useAllPostsAdmin, useCategoriesAdmin, deleteCategoryAdmin, editCategoryAdmin} from"@/hooks/useBlogPosts";
import { BlogPreviewCard} from"@/components/BlogPreviewCard";
import { blog} from"@/content/content";
import type { BlogPost} from"@/lib/types";
import ReactQuill from"react-quill";
import"react-quill/dist/quill.snow.css";

const quillModules = {
 toolbar: [
 ['bold','italic','underline'],
 [{'list':'ordered'}, {'list':'bullet'}],
 [{'align': []}],
 ['clean']
 ],
};

// ─── Types ────────────────────────────────────────────────

type Section = {
 id: string;
 order: number;
 title: string;
 paragraphs: string[];
 insight: string;
};

type Download = { label: string; href: string};

type EditorState = {
 title: string;
 slug: string;
 date: string;
 category: string;
 excerpt: string;
 imageUrl: string;
 intro: string[];
 sections: Section[];
 downloads: Download[];
 featured: boolean;
 moreArticlesOverride: string[];
};

// ─── Helpers ──────────────────────────────────────────────

function slugify(text: string): string {
 return text
 .toLowerCase()
 .replace(/[^a-z0-9]+/g,"-")
 .replace(/(^-|-$)/g,"");
}

function makeId(): string {
 return Math.random().toString(36).slice(2, 10);
}

function defaultState(): EditorState {
 return {
 title:"",
 slug:"",
 date: new Date().toISOString().slice(0, 10),
 category:"",
 excerpt:"",
 imageUrl:"",
 intro: [""],
 sections: [{ id: makeId(), order: 0, title:"", paragraphs: [""], insight:""}],
 downloads: [],
 featured: false,
 moreArticlesOverride: [],
};
}

function postToEditorState(post: BlogPost): EditorState {
 return {
 title: post.title,
 slug: post.slug,
 date: post.date,
 category: post.category ??"",
 excerpt: post.excerpt,
 imageUrl: post.imageUrl,
 intro: post.content?.intro.length ? post.content.intro : [""],
 sections: post.content?.sections.length
 ? post.content.sections.map((s) => ({
 id: s.id,
 order: s.order,
 title: s.title ??"",
 paragraphs: s.paragraphs.length ? s.paragraphs : [""],
 insight: s.insight ??"",
}))
 : [{ id: makeId(), order: 0, title:"", paragraphs: [""], insight:""}],
 downloads: post.content?.downloads ?? [],
 featured: post.featured,
 moreArticlesOverride: post.moreArticlesOverride ?? [],
};
}

// Build a preview BlogPost from editor state (for the live preview card)
function editorStateToPreviewPost(state: EditorState): BlogPost {
 return {
 id:"preview",
 slug: state.slug,
 date: state.date,
 title: state.title ||"Post title",
 excerpt: state.excerpt ||"Post excerpt will appear here…",
 imageUrl: state.imageUrl ||"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
 href:`/blog/${state.slug}`,
 category: state.category || null,
 featured: state.featured,
 status:"published",
 gridOrder: 0,
 moreArticlesOverride: state.moreArticlesOverride,
 content: {
 intro: state.intro,
 sections: state.sections.map((s) => ({
 id: s.id,
 order: s.order,
 title: s.title || undefined,
 paragraphs: s.paragraphs,
 insight: s.insight || undefined,
})),
 downloads: state.downloads.length ? state.downloads : undefined,
},
};
}

// ─── Icons ────────────────────────────────────────────────

const GripIcon = () => (
 <svg width="14"height="14"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <circle cx="9"cy="7"r="1"/><circle cx="15"cy="7"r="1"/>
 <circle cx="9"cy="12"r="1"/><circle cx="15"cy="12"r="1"/>
 <circle cx="9"cy="17"r="1"/><circle cx="15"cy="17"r="1"/>
 </svg>
);

const TrashIcon = () => (
 <svg width="14"height="14"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
 <path d="M10 11v6"/><path d="M14 11v6"/>
 </svg>
);

const PlusIcon = () => (
 <svg width="14"height="14"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <line x1="12"y1="5"x2="12"y2="19"/><line x1="5"y1="12"x2="19"y2="12"/>
 </svg>
);

// ─── Sortable section row ─────────────────────────────────

const SortableSection = ({
 section,
 onChange,
 onRemove,
}: {
 section: Section;
 onChange: (updated: Section) => void;
 onRemove: (id: string) => void;
}) => {
 const { attributes, listeners, setNodeRef, transform, transition, isDragging} =
 useSortable({ id: section.id});

 const style = {
 transform: CSS.Transform.toString(transform),
 transition,
 opacity: isDragging ? 0.4 : 1,
};

 return (
 <div
 ref={setNodeRef}
 style={style}
 className="bg-white border border-black/8 rounded-xl p-5 flex flex-col gap-4"
 >
 <div className="flex items-start gap-3">
 <button
 {...attributes}
 {...listeners}
 className="mt-1 text-black/25 hover:text-black/50 cursor-grab active:cursor-grabbing"
 >
 <GripIcon />
 </button>
 <div className="flex-1 flex flex-col gap-3">
 <input
 type="text"
 placeholder="Section title (optional)"
 value={section.title}
 onChange={(e) => onChange({ ...section, title: e.target.value})}
 className="w-full text-sm font-semibold bg-transparent border-b border-black/10 pb-1 outline-none focus:border-black/30 placeholder-black/45 transition-colors"
 />
 {section.paragraphs.map((para, i) => (
 <div key={i} className="flex gap-2 items-start">
 <div className="flex-1">
 <ReactQuill
 theme="snow"
 modules={quillModules}
 placeholder={`Paragraph ${i + 1}`}
 value={para}
 onChange={(val) => {
 const updated = [...section.paragraphs];
 updated[i] = val;
 onChange({ ...section, paragraphs: updated});
}}
 className="bg-white rounded-lg [&_.ql-container]:min-h-[80px]"
 />
 </div>
 {section.paragraphs.length > 1 && (
 <button
 onClick={() => {
 const updated = section.paragraphs.filter((_, idx) => idx !== i);
 onChange({ ...section, paragraphs: updated});
}}
 className="mt-1 text-black/20 hover:text-red-400 transition-colors"
 >
 <TrashIcon />
 </button>
)}
 </div>
))}
 <button
 onClick={() => onChange({ ...section, paragraphs: [...section.paragraphs,""]})}
 className="self-start text-xs text-black/40 hover:text-black flex items-center gap-1 transition-colors"
 >
 <PlusIcon /> Add paragraph
 </button>
 <div>
 <label className="text-[10px] font-semibold uppercase tracking-wider text-black/35 block mb-1">
 Insight (optional)
 </label>
 <ReactQuill
 theme="snow"
 modules={quillModules}
 placeholder="Key takeaway or pull quote…"
 value={section.insight}
 onChange={(val) => onChange({ ...section, insight: val})}
 className="w-full bg-white rounded-lg [&_.ql-container]:min-h-[80px]"
 />
 </div>
 </div>
 <button
 onClick={() => onRemove(section.id)}
 className="mt-1 text-black/20 hover:text-red-400 transition-colors"
 >
 <TrashIcon />
 </button>
 </div>
 </div>
);
};

// ─── Custom Category Select ─────────────────────────────────

const getTodayMaxDate = () => {
 // Get today's date in local time, formatted as YYYY-MM-DD
 const today = new Date();
 const year = today.getFullYear();
 const month = String(today.getMonth() + 1).padStart(2,'0');
 const day = String(today.getDate()).padStart(2,'0');
 return`${year}-${month}-${day}`;
};

const CategorySelect = ({
 value,
 onChange,
}: {
 value: string;
 onChange: (val: string) => void;
}) => {
 const { categories: dbCategories, refetchCategories} = useCategoriesAdmin();
 const [isOpen, setIsOpen] = useState(false);
 const [sessionCategories, setSessionCategories] = useState<string[]>([]);
 const [editingCat, setEditingCat] = useState<string | null>(null);
 const [editValue, setEditValue] = useState("");
 const [newCat, setNewCat] = useState("");
 const [isAdding, setIsAdding] = useState(false);
 const dropdownRef = useRef<HTMLDivElement>(null);

 // Keep a local session list so newly added categories stay visible
 // even before they are saved to the database.
 useEffect(() => {
 setSessionCategories((prev) =>
 Array.from(new Set([...prev, ...dbCategories].filter(Boolean))).sort()
);
}, [dbCategories]);

 const categories = Array.from(
 new Set([...dbCategories, ...sessionCategories, value].filter(Boolean))
).sort();

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
 setIsOpen(false);
 setEditingCat(null);
 setIsAdding(false);
}
};
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

 const handleDelete = async (e: React.MouseEvent, cat: string) => {
 e.stopPropagation();
 if (window.confirm(`Are you sure you want to delete the category"${cat}"? This will also delete ALL blogs associated with it.`)) {
 await deleteCategoryAdmin(cat);
 setSessionCategories((prev) => prev.filter((item) => item !== cat));
 if (value === cat) onChange("");
 refetchCategories();
}
};

 const handleEditSave = async (e: React.MouseEvent | React.KeyboardEvent, oldCat: string) => {
 e.stopPropagation();
 if (!editValue.trim() || editValue === oldCat) {
 setEditingCat(null);
 return;
}
 await editCategoryAdmin(oldCat, editValue.trim());
 setSessionCategories((prev) =>
 prev.map((item) => (item === oldCat ? editValue.trim() : item))
);
 if (value === oldCat) onChange(editValue.trim());
 setEditingCat(null);
 refetchCategories();
};

 const handleAddSave = (e: React.MouseEvent | React.KeyboardEvent) => {
 e.stopPropagation();
 if (newCat.trim()) {
 setSessionCategories((prev) =>
 Array.from(new Set([...prev, newCat.trim()])).sort()
);
 onChange(newCat.trim());
 setIsAdding(false);
 setNewCat("");
 setIsOpen(false);
}
};

 return (
 <div className="relative"ref={dropdownRef}>
 <div
 onClick={() => setIsOpen(!isOpen)}
 className="w-full text-sm bg-neutral-50 border border-black/8 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-black/15 cursor-pointer flex items-center justify-between min-h-[34px]"
 >
 <span className={value ?"text-black":"text-black/45"}>
 {value ||"Select category"}
 </span>
 <svg width="12"height="12"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"className={`transition-transform ${isOpen ?"rotate-180":""}`}>
 <polyline points="6 9 12 15 18 9"/>
 </svg>
 </div>

 {isOpen && (
 <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/8 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto py-1">
 {/* None option */}
 <div
 onClick={() => { onChange(""); setIsOpen(false);}}
 className="px-3 py-2 text-sm hover:bg-neutral-100 cursor-pointer border-b border-black/5"
 >
 None
 </div>

 {/* Existing categories */}
 {categories.map((cat) => (
 <div
 key={cat}
 className="px-3 py-2 text-sm hover:bg-neutral-100 cursor-pointer flex items-center justify-between group border-b border-black/5"
 onClick={() => {
 if (editingCat !== cat) {
 onChange(cat);
 setIsOpen(false);
}
}}
 >
 {editingCat === cat ? (
 <div className="flex items-center gap-2 w-full"onClick={(e) => e.stopPropagation()}>
 <input
 autoFocus
 type="text"
 value={editValue}
 onChange={(e) => setEditValue(e.target.value)}
 onKeyDown={(e) => e.key ==="Enter"&& handleEditSave(e, cat)}
 className="flex-1 text-sm bg-white border border-black/15 rounded px-2 py-1 outline-none"
 />
 <button onClick={(e) => handleEditSave(e, cat)} className="text-xs text-blue-600 font-medium">Save</button>
 </div>
) : (
 <>
 <span>{cat}</span>
 <div className="hidden group-hover:flex items-center gap-2">
 <button
 onClick={(e) => {
 e.stopPropagation();
 setEditingCat(cat);
 setEditValue(cat);
}}
 className="text-black/40 hover:text-blue-600 transition-colors"
 title="Edit"
 >
 <svg width="14"height="14"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
 </svg>
 </button>
 <button
 onClick={(e) => handleDelete(e, cat)}
 className="text-black/40 hover:text-red-500 transition-colors"
 title="Delete"
 >
 <TrashIcon />
 </button>
 </div>
 </>
)}
 </div>
))}

 {/* Add new category */}
 {isAdding ? (
 <div className="px-3 py-2 flex items-center gap-2">
 <input
 autoFocus
 type="text"
 value={newCat}
 onChange={(e) => setNewCat(e.target.value)}
 onKeyDown={(e) => e.key ==="Enter"&& handleAddSave(e)}
 className="flex-1 text-sm bg-white border border-black/15 rounded px-2 py-1 outline-none"
 placeholder="New category name"
 />
 <button onClick={handleAddSave} className="text-xs text-blue-600 font-medium">Save</button>
 </div>
) : (
 <div
 onClick={(e) => { e.stopPropagation(); setIsAdding(true);}}
 className="px-3 py-2 text-sm text-blue-600 hover:bg-neutral-100 cursor-pointer"
 >
 + Add new category
 </div>
)}
 </div>
)}
 </div>
);
};

// ─── Main PostEditor ──────────────────────────────────────

export const PostEditor = () => {
 const { slug} = useParams<{ slug?: string}>();
 const navigate = useNavigate();
 const isNew = !slug || slug ==="new";

 const [editorState, setEditorState] = useState<EditorState>(defaultState());
 const [savedState, setSavedState] = useState<EditorState>(defaultState());
 const [loading, setLoading] = useState(!isNew);
 const [saving, setSaving] = useState(false);
 const [saveError, setSaveError] = useState<string | null>(null);
 const [slugError, setSlugError] = useState<string | null>(null);
 const [imageError, setImageError] = useState<string | null>(null);
 const [imageUploading, setImageUploading] = useState(false);
 const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
 const [showLeaveWarning, setShowLeaveWarning] = useState(false);
 const [showDiscardWarning, setShowDiscardWarning] = useState(false);
 
 // Tabs for structured editing
 const [activeTab, setActiveTab] = useState<"preview"|"detail">("preview");
 
 const fileInputRef = useRef<HTMLInputElement>(null);
 const { posts: allPosts} = useAllPostsAdmin();

 // Load existing post
 useEffect(() => {
 if (isNew) { setLoading(false); return;}
 fetchPostBySlugAdmin(slug!).then((post) => {
 if (post) {
 const state = postToEditorState(post);
 setEditorState(state);
 setSavedState(state);
}
 setLoading(false);
});
}, [slug, isNew]);

 // Auto-generate slug from title (unless manually edited)
 useEffect(() => {
 if (!slugManuallyEdited) {
 setEditorState((prev) => ({ ...prev, slug: slugify(prev.title)}));
}
}, [editorState.title, slugManuallyEdited]);

 const update = useCallback(<K extends keyof EditorState>(key: K, value: EditorState[K]) => {
 setEditorState((prev) => ({ ...prev, [key]: value}));
}, []);

 // Slug uniqueness check
 const checkSlugUnique = async (s: string) => {
 if (!s) return;
 const { data} = await supabase
 .from("posts")
 .select("id, slug")
 .eq("slug", s)
 .single();
 if (data && data.slug !== slug) {
 setSlugError("This slug is already taken. Choose a different one.");
} else {
 setSlugError(null);
}
};

 // Image upload to Supabase Storage
 const handleImageUpload = async (file: File) => {
 setImageUploading(true);
 setImageError(null);

 try {
 const bucket ="blog-images";
 const extFromName = file.name.includes(".") ? file.name.split(".").pop() :"";
 const extFromType = file.type.startsWith("image/") ? file.type.split("/")[1] :"";
 const ext = (extFromName || extFromType ||"png").toLowerCase();
 const path =`${makeId()}.${ext}`;

 const { error} = await supabase.storage
 .from(bucket)
 .upload(path, file, {
 upsert: true,
 contentType: file.type ||`image/${ext}`,
});

 if (error) {
 throw error;
}

 const { data: urlData} = supabase.storage
 .from(bucket)
 .getPublicUrl(path);
 update("imageUrl", urlData.publicUrl);
} catch (err: unknown) {
 setImageError(err instanceof Error ? err.message :"Image upload failed.");
} finally {
 setImageUploading(false);
}
};

 // Save to Supabase
 const save = async (targetStatus:"draft"|"published") => {
 if (slugError) return;
 if (!editorState.title.trim() || !editorState.slug.trim()) {
 setSaveError("Title and slug are required.");
 return;
}
 setSaving(true);
 setSaveError(null);

 try {
 // Upsert the post row
 const { data: postRow, error: postErr} = await supabase
 .from("posts")
 .upsert(
 {
 slug: editorState.slug,
 title: editorState.title,
 date: editorState.date,
 excerpt: editorState.excerpt,
 image_url: editorState.imageUrl,
 category: editorState.category || null,
 intro: editorState.intro.filter((p) => p.trim()),
 downloads: editorState.downloads.filter((d) => d.label.trim()),
 featured: editorState.featured,
 status: targetStatus,
 more_articles_override: editorState.moreArticlesOverride.length
 ? editorState.moreArticlesOverride
 : null,
},
 { onConflict:"slug"}
)
 .select()
 .single();

 if (postErr) throw postErr;
 if (!postRow) throw new Error("Save succeeded but no post row was returned.");

 // Replace all sections
 await supabase.from("post_sections").delete().eq("post_id", postRow.id);
 const sectionInserts = editorState.sections
 .filter((s) => s.paragraphs.some((p) => p.trim()))
 .map((s, i) => ({
 post_id: postRow.id,
 order: i,
 title: s.title.trim() || null,
 paragraphs: s.paragraphs.filter((p) => p.trim()),
 insight: s.insight.trim() || null,
}));
 if (sectionInserts.length) {
 await supabase.from("post_sections").insert(sectionInserts);
}

 setSavedState(editorState);
 if (isNew) {
 navigate(`/admin/post/${editorState.slug}`, { replace: true});
}
} catch (err: unknown) {
 setSaveError(err instanceof Error ? err.message :"Save failed.");
} finally {
 setSaving(false);
}
};

 const discard = () => {
 setEditorState(savedState);
 setSlugError(null);
};

 const isDirty = JSON.stringify(editorState) !== JSON.stringify(savedState);

 // Prevent closing the tab if there are unsaved changes
 useEffect(() => {
 const handleBeforeUnload = (e: BeforeUnloadEvent) => {
 if (isDirty) {
 e.preventDefault();
 e.returnValue ="";
}
};
 window.addEventListener("beforeunload", handleBeforeUnload);
 return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [isDirty]);

 const sensors = useSensors(
 useSensor(PointerSensor),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates})
);

 const handleSectionDragEnd = (event: DragEndEvent) => {
 const { active, over} = event;
 if (!over || active.id === over.id) return;
 const oldIdx = editorState.sections.findIndex((s) => s.id === active.id);
 const newIdx = editorState.sections.findIndex((s) => s.id === over.id);
 update("sections", arrayMove(editorState.sections, oldIdx, newIdx));
};

 const previewPost = editorStateToPreviewPost(editorState);
 // Posts available for More Articles override picker
 const otherPosts = allPosts.filter((p) => p.slug !== editorState.slug);

 if (loading) {
 return (
 <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
 <div className="w-6 h-6 border-2 border-black/15 border-t-black rounded-full animate-spin"/>
 </div>
);
}

 return (
 <div className="min-h-screen bg-[#f8f7f4]">
 {/* Leave Warning Modal */}
 {showLeaveWarning && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
 <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
 <h3 className="text-xl font-semibold mb-2 tracking-tight">Unsaved Changes</h3>
 <p className="text-black/60 text-sm mb-8 leading-relaxed">
 You have unsaved changes. Do you want to save them as a draft before leaving?
 </p>
 <div className="flex justify-end gap-3">
 <button 
 onClick={() => setShowLeaveWarning(false)}
 className="px-4 py-2 text-sm font-medium text-black/60 hover:text-black transition-colors"
 >
 Cancel
 </button>
 <button 
 onClick={() => {
 setShowLeaveWarning(false);
 navigate("/admin");
}}
 className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
 >
 Leave without saving
 </button>
 <button 
 onClick={async () => {
 await save("draft");
 setShowLeaveWarning(false);
 navigate("/admin");
}}
 className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-black/85 rounded-lg transition-colors"
 >
 Save Draft & Leave
 </button>
 </div>
 </div>
 </div>
)}

 {/* Discard Warning Modal */}
 {showDiscardWarning && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
 <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
 <h3 className="text-xl font-semibold mb-2 tracking-tight">Discard Changes?</h3>
 <p className="text-black/60 text-sm mb-8 leading-relaxed">
 Are you sure you want to discard your unsaved changes? This action cannot be undone.
 </p>
 <div className="flex justify-end gap-3">
 <button 
 onClick={() => setShowDiscardWarning(false)}
 className="px-4 py-2 text-sm font-medium text-black/60 hover:text-black transition-colors"
 >
 Cancel
 </button>
 <button 
 onClick={() => {
 setShowDiscardWarning(false);
 discard();
}}
 className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
 >
 Discard Changes
 </button>
 </div>
 </div>
 </div>
)}

 {/* Sticky action bar */}
 <header className="sticky top-0 z-40 bg-white border-b border-black/8 px-6 md:px-10 py-3 flex items-center gap-3 flex-wrap">
 <Link
 to="/admin"
 onClick={(e) => {
 if (isDirty) {
 e.preventDefault();
 setShowLeaveWarning(true);
}
}}
 className="text-sm text-black/40 hover:text-black transition-colors mr-2"
 >
 ← Dashboard
 </Link>

 <span className="text-sm font-medium text-black truncate max-w-[200px]">
 {isNew ?"New Post": editorState.title ||"Untitled"}
 </span>

 <div className="ml-auto flex items-center gap-2 flex-wrap">
 {saveError && (
 <span className="text-xs text-red-500 max-w-[200px] truncate">{saveError}</span>
)}
 {isDirty && (
 <button
 onClick={() => setShowDiscardWarning(true)}
 className="px-3 py-1.5 rounded-full text-sm font-medium border border-black/15 text-black/60 hover:text-black hover:border-black/30 transition-colors"
 >
 Discard
 </button>
)}
 <button
 onClick={() => save("draft")}
 disabled={saving || !!slugError}
 className="px-4 py-1.5 rounded-full text-sm font-medium border border-black/15 hover:border-black/30 transition-colors disabled:opacity-40"
 >
 Save Draft
 </button>
 <button
 id="admin-publish-btn"
 onClick={() => save("published")}
 disabled={saving || !!slugError}
 className="px-4 py-1.5 rounded-full text-sm font-medium bg-black text-white hover:bg-black/85 transition-colors disabled:opacity-40 flex items-center gap-2"
 >
 {saving ? (
 <>
 <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/>
 Saving…
 </>
) :"Publish"}
 </button>
 </div>
 </header>

 <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
 {/* ─── Left: Editor ─────────────────────────────────── */}
 <div className="flex flex-col gap-6">
 
 {/* Tab Navigation */}
 <div className="flex bg-neutral-200/50 p-1.5 rounded-xl w-fit">
 <button
 onClick={() => setActiveTab("preview")}
 className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
 activeTab ==="preview"
 ?"bg-white text-black shadow-sm"
 :"text-black/50 hover:text-black hover:bg-black/5"
}`}
 >
 1. Preview Settings
 </button>
 <button
 onClick={() => setActiveTab("detail")}
 className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
 activeTab ==="detail"
 ?"bg-white text-black shadow-sm"
 :"text-black/50 hover:text-black hover:bg-black/5"
}`}
 >
 2. Read More Page Settings
 </button>
 </div>

 {activeTab ==="preview"&& (
 <>
 {/* Meta fields */}
 <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
 <h2 className="text-[13px] font-semibold uppercase tracking-wider text-black/35">Post Details</h2>

 {/* Title */}
 <div>
 <label className="text-[10px] font-semibold uppercase tracking-wider text-black/35 block mb-1.5">
 Title *
 </label>
 <input
 type="text"
 placeholder="Post title…"
 value={editorState.title}
 onChange={(e) => update("title", e.target.value)}
 className="w-full text-xl font-semibold tracking-[-0.04em] bg-transparent border-b border-black/10 pb-2 outline-none focus:border-black/30 placeholder-black/45 transition-colors"
 />
 </div>

 {/* Slug */}
 <div>
 <label className="text-[10px] font-semibold uppercase tracking-wider text-black/35 block mb-1.5">
 Slug (URL) *
 </label>
 <div className="flex items-center gap-2">
 <span className="text-xs text-black/30">/blog/</span>
 <input
 type="text"
 value={editorState.slug}
 onChange={(e) => {
 setSlugManuallyEdited(true);
 update("slug", e.target.value);
}}
 onBlur={() => checkSlugUnique(editorState.slug)}
 className="flex-1 text-sm bg-neutral-50 border border-black/8 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-black/15 font-mono"
 />
 </div>
 {slugError && (
 <p className="text-xs text-red-500 mt-1">{slugError}</p>
)}
 </div>

 {/* Date + Category */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-[10px] font-semibold uppercase tracking-wider text-black/35 block mb-1.5">Date</label>
 <input
 type="date"
 value={editorState.date}
 max={getTodayMaxDate()}
 onChange={(e) => update("date", e.target.value)}
 className="w-full text-sm bg-neutral-50 border border-black/8 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-black/15"
 />
 </div>
 <div>
 <label className="text-[10px] font-semibold uppercase tracking-wider text-black/35 block mb-1.5">Category</label>
 <CategorySelect
 value={editorState.category}
 onChange={(val) => update("category", val)}
 />
 </div>
 </div>

 {/* Excerpt */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <label className="text-[10px] font-semibold uppercase tracking-wider text-black/35 block">Excerpt</label>
 <span className={`text-[10px] font-medium ${editorState.excerpt.length > 140 ?'text-red-500':'text-black/35'}`}>
 {editorState.excerpt.length} / 140 characters max
 </span>
 </div>
 <textarea
 rows={3}
 placeholder="Short summary shown in cards and grid…"
 value={editorState.excerpt}
 onChange={(e) => {
 update("excerpt", e.target.value.slice(0, 140));
}}
 className="w-full text-sm bg-neutral-50 border border-black/8 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-black/15 resize-none placeholder-black/45"
 />
 <p className="text-[10px] text-black/30 mt-1">This description appears on the grid cards. Keep it under 140 characters to naturally fit within 3 lines without getting cut off.</p>
 </div>

 {/* Featured */}
 <label className="flex items-center gap-3 cursor-pointer select-none">
 <div
 onClick={() => update("featured", !editorState.featured)}
 className={`w-10 h-5 rounded-full transition-colors relative ${editorState.featured ?"bg-black":"bg-neutral-200"}`}
 >
 <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${editorState.featured ?"translate-x-5":"translate-x-0.5"}`} />
 </div>
 <span className="text-sm font-medium text-black/70">Featured post</span>
 <span className="text-xs text-black/30">(only one post can be featured at a time)</span>
 </label>
 </div>

 {/* Hero image */}
 <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
 <h2 className="text-[13px] font-semibold uppercase tracking-wider text-black/35">Hero Image</h2>

 {editorState.imageUrl && (
 <div className="aspect-[16/7] rounded-xl overflow-hidden">
 <img src={editorState.imageUrl} alt="Hero"className="w-full h-full object-cover"/>
 </div>
)}

 <div className="flex flex-col sm:flex-row gap-3">
 <input
 type="url"
 placeholder="Paste image URL…"
 value={editorState.imageUrl}
 onChange={(e) => update("imageUrl", e.target.value)}
 className="flex-1 text-sm bg-neutral-50 border border-black/8 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-black/15 placeholder-black/45"
 />
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 disabled={imageUploading}
 className="px-4 py-2.5 text-sm font-medium border border-black/15 rounded-xl hover:bg-neutral-50 transition-colors disabled:opacity-40 whitespace-nowrap"
 >
 {imageUploading ?"Uploading…":"Upload image"}
 </button>
 <input
 ref={fileInputRef}
 type="file"
 accept="image/*"
 className="hidden"
 onChange={(e) => {
 const file = e.target.files?.[0];
 if (file) {
 if (file.size > 5 * 1024 * 1024) {
 setImageError("Image size must be less than 5MB.");
 e.currentTarget.value ="";
 return;
}
 handleImageUpload(file);
 e.currentTarget.value ="";
}
}}
 />
 </div>
 {imageError && (
 <p className="text-xs text-red-500">{imageError}</p>
)}
 </div>
 </>
)}

 {activeTab ==="detail"&& (
 <>
 {/* Shared Title & Date (Read-only reference) */}
 <div className="bg-white/50 border border-black/8 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
 <p className="text-xs text-black/40">Editing details for:</p>
 <div>
 <h2 className="text-xl font-semibold">{editorState.title ||"Untitled"}</h2>
 <p className="text-sm text-black/50">{editorState.date}</p>
 </div>
 </div>

 {/* Intro paragraphs */}
 <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
 <h2 className="text-[13px] font-semibold uppercase tracking-wider text-black/35">Intro</h2>
 {editorState.intro.map((para, i) => (
 <div key={i} className="flex gap-2 items-start">
 <div className="flex-1">
 <ReactQuill
 theme="snow"
 modules={quillModules}
 placeholder={`Intro paragraph ${i + 1}…`}
 value={para}
 onChange={(val) => {
 const updated = [...editorState.intro];
 updated[i] = val;
 update("intro", updated);
}}
 className="bg-white rounded-xl [&_.ql-container]:min-h-[80px]"
 />
 </div>
 {editorState.intro.length > 1 && (
 <button
 onClick={() => update("intro", editorState.intro.filter((_, idx) => idx !== i))}
 className="mt-1 text-black/20 hover:text-red-400 transition-colors"
 >
 <TrashIcon />
 </button>
)}
 </div>
))}
 <button
 onClick={() => update("intro", [...editorState.intro,""])}
 className="self-start text-xs text-black/40 hover:text-black flex items-center gap-1 transition-colors"
 >
 <PlusIcon /> Add intro paragraph
 </button>
 </div>

 {/* Sections */}
 <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
 <h2 className="text-[13px] font-semibold uppercase tracking-wider text-black/35">Sections</h2>
 <DndContext
 sensors={sensors}
 collisionDetection={closestCenter}
 onDragEnd={handleSectionDragEnd}
 >
 <SortableContext
 items={editorState.sections.map((s) => s.id)}
 strategy={verticalListSortingStrategy}
 >
 <div className="flex flex-col gap-4">
 {editorState.sections.map((section) => (
 <SortableSection
 key={section.id}
 section={section}
 onChange={(updated) =>
 update(
"sections",
 editorState.sections.map((s) =>
 s.id === updated.id ? updated : s
)
)
}
 onRemove={(id) =>
 update(
"sections",
 editorState.sections.filter((s) => s.id !== id)
)
}
 />
))}
 </div>
 </SortableContext>
 </DndContext>
 <button
 onClick={() =>
 update("sections", [
 ...editorState.sections,
 {
 id: makeId(),
 order: editorState.sections.length,
 title:"",
 paragraphs: [""],
 insight:"",
},
 ])
}
 className="self-start text-xs text-black/40 hover:text-black flex items-center gap-1 transition-colors"
 >
 <PlusIcon /> Add section
 </button>
 </div>

 {/* Downloads */}
 <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
 <h2 className="text-[13px] font-semibold uppercase tracking-wider text-black/35">Downloads (optional)</h2>
 {editorState.downloads.map((dl, i) => (
 <div key={i} className="flex gap-2 items-center">
 <input
 type="text"
 placeholder="Label"
 value={dl.label}
 onChange={(e) => {
 const updated = [...editorState.downloads];
 updated[i] = { ...dl, label: e.target.value};
 update("downloads", updated);
}}
 className="flex-1 text-sm bg-neutral-50 border border-black/8 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-black/15 placeholder-black/45"
 />
 <input
 type="url"
 placeholder="URL"
 value={dl.href}
 onChange={(e) => {
 const updated = [...editorState.downloads];
 updated[i] = { ...dl, href: e.target.value};
 update("downloads", updated);
}}
 className="flex-1 text-sm bg-neutral-50 border border-black/8 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-black/15 placeholder-black/45"
 />
 <button
 onClick={() =>
 update(
"downloads",
 editorState.downloads.filter((_, idx) => idx !== i)
)
}
 className="text-black/20 hover:text-red-400 transition-colors"
 >
 <TrashIcon />
 </button>
 </div>
))}
 <button
 onClick={() =>
 update("downloads", [...editorState.downloads, { label:"", href:""}])
}
 className="self-start text-xs text-black/40 hover:text-black flex items-center gap-1 transition-colors"
 >
 <PlusIcon /> Add download
 </button>
 </div>

 {/* More Articles override picker */}
 <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
 <div>
 <h2 className="text-[13px] font-semibold uppercase tracking-wider text-black/35">More Articles (optional override)</h2>
 <p className="text-xs text-black/35 mt-1">
 Leave empty to automatically show the 3 most recent other published posts.
 Select up to 3 to pin specific posts.
 </p>
 </div>
 <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
 {otherPosts.map((p) => {
 const checked = editorState.moreArticlesOverride.includes(p.id);
 const maxReached =
 !checked && editorState.moreArticlesOverride.length >= 3;
 return (
 <label
 key={p.id}
 className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
 checked
 ?"border-black/25 bg-neutral-50"
 : maxReached
 ?"border-black/5 opacity-40 cursor-not-allowed"
 :"border-black/8 hover:border-black/20"
}`}
 >
 <input
 type="checkbox"
 checked={checked}
 disabled={maxReached}
 onChange={() => {
 if (checked) {
 update(
"moreArticlesOverride",
 editorState.moreArticlesOverride.filter((id) => id !== p.id)
);
} else {
 update("moreArticlesOverride", [
 ...editorState.moreArticlesOverride,
 p.id,
 ]);
}
}}
 className="w-4 h-4 accent-black"
 />
 <div className="w-10 h-7 rounded overflow-hidden bg-neutral-100 shrink-0">
 <img src={p.imageUrl} alt=""className="w-full h-full object-cover"/>
 </div>
 <span className="text-sm font-medium text-black/80 line-clamp-1">{p.title}</span>
 <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
 p.status ==="published"
 ?"bg-emerald-50 text-emerald-700"
 :"bg-neutral-100 text-black/35"
}`}>
 {p.status}
 </span>
 </label>
);
})}
 {otherPosts.length === 0 && (
 <p className="text-sm text-black/30 text-center py-4">No other posts yet.</p>
)}
 </div>
 {editorState.moreArticlesOverride.length > 0 && (
 <button
 onClick={() => update("moreArticlesOverride", [])}
 className="self-start text-xs text-black/35 hover:text-black transition-colors"
 >
 Clear override (use automatic)
 </button>
)}
 </div>
 </>
)}
 </div>

 {/* ─── Right: Live Preview Panel ────────────────────── */}
 <div className="hidden xl:block">
 <div className="sticky top-[68px]">
 <p className="text-[10px] font-semibold uppercase tracking-wider text-black/30 mb-4">
 {activeTab ==="preview"?"Live Preview Cards":"Live Page Preview"}
 </p>
 
 {activeTab ==="preview"? (
 <>
 <div className="bg-white border border-black/8 rounded-2xl p-5 shadow-sm mb-4">
 <p className="text-[9px] font-semibold uppercase tracking-wider text-black/25 mb-4">
 How it looks in the blog grid
 </p>
 <BlogPreviewCard post={previewPost} variant="grid"delay={0} />
 </div>
 <div className="bg-white border border-black/8 rounded-2xl p-5 shadow-sm">
 <p className="text-[9px] font-semibold uppercase tracking-wider text-black/25 mb-4">
 How it looks in More Articles
 </p>
 <BlogPreviewCard post={previewPost} variant="article"delay={0} />
 </div>
 </>
) : (
 <div className="bg-[#f3f1ed] text-black border border-black/8 rounded-2xl p-8 shadow-sm max-h-[85vh] overflow-y-auto">
 {/* Simplified BlogPostDetail preview */}
 <time className="text-[16px] font-medium text-black/90 block mb-4 tracking-normal">
 {new Date(previewPost.date).toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric"})}
 </time>
 <h1 className="text-[48px] font-semibold leading-[0.95] tracking-[-0.06em] mb-8">
 {previewPost.title}
 </h1>
 
 {/* Right side simulation */}
 <div className="flex flex-col gap-2 mb-6">
 <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.04em]">
 {previewPost.title}
 </h2>
 {previewPost.category && (
 <p className="text-[12px] font-medium text-black/50 uppercase tracking-widest">
 {previewPost.category}
 </p>
)}
 </div>

 <div className="flex flex-col gap-5 pb-6 mb-6 border-b border-black/20">
 {previewPost.content?.intro.map((p, i) => (
 <p key={i} className="text-[18px] leading-[1.5] text-black/90 font-medium">{p}</p>
))}
 </div>

 {previewPost.content?.sections.map((s, i) => (
 <div key={i} className={`mb-6 pb-6 ${(i !== (previewPost.content?.sections.length || 0) - 1) || (previewPost.content?.downloads && previewPost.content.downloads.length > 0) ?"border-b border-black/20":""}`}>
 {s.title && <h2 className="text-[32px] font-semibold tracking-[-0.04em] mb-4">{s.title}</h2>}
 {s.paragraphs.map((p, j) => (
 <p key={j} className="text-[16px] leading-[1.6] text-black/80 mb-3">{p}</p>
))}
 {s.insight && (
 <p className="text-[16px] leading-[1.6] text-black font-medium mt-4">
 <span className="font-bold">Insight: </span>{s.insight}
 </p>
)}
 </div>
))}
 </div>
)}
 </div>
 </div>
 </div>
 </div>
);
};
