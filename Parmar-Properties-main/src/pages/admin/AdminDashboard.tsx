import { useState, useEffect} from"react";
import { Link, useNavigate} from"react-router-dom";
import {
 DndContext,
 closestCenter,
 KeyboardSensor,
 PointerSensor,
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
import { signOut} from"@/lib/auth";
import { useAllPostsAdmin} from"@/hooks/useBlogPosts";
import type { BlogPost} from"@/lib/types";

// ─── Icons ───────────────────────────────────────────────

const GripIcon = () => (
 <svg width="14"height="14"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <circle cx="9"cy="7"r="1"/><circle cx="15"cy="7"r="1"/>
 <circle cx="9"cy="12"r="1"/><circle cx="15"cy="12"r="1"/>
 <circle cx="9"cy="17"r="1"/><circle cx="15"cy="17"r="1"/>
 </svg>
);

const StarIcon = ({ filled}: { filled: boolean}) => (
 <svg width="14"height="14"viewBox="0 0 24 24"fill={filled ?"currentColor":"none"} stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
 </svg>
);

const EditIcon = () => (
 <svg width="14"height="14"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
 <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
 </svg>
);

const TrashIcon = () => (
 <svg width="14"height="14"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
 <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
 </svg>
);

const PlusIcon = () => (
 <svg width="16"height="16"viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"strokeLinejoin="round">
 <line x1="12"y1="5"x2="12"y2="19"/><line x1="5"y1="12"x2="19"y2="12"/>
 </svg>
);

// ─── Sortable Row ─────────────────────────────────────────

const SortableRow = ({
 post,
 onToggleFeatured,
 onToggleStatus,
 onDelete,
}: {
 post: BlogPost;
 onToggleFeatured: (id: string, current: boolean) => void;
 onToggleStatus: (id: string, current:"draft"|"published") => void;
 onDelete: (id: string, title: string) => void;
}) => {
 const { attributes, listeners, setNodeRef, transform, transition, isDragging} =
 useSortable({ id: post.id});

 const style = {
 transform: CSS.Transform.toString(transform),
 transition,
 opacity: isDragging ? 0.5 : 1,
 zIndex: isDragging ? 10 : undefined,
};

 return (
 <tr
 ref={setNodeRef}
 style={style}
 className="border-b border-black/5 hover:bg-neutral-50/80 transition-colors group"
 >
 {/* Drag handle */}
 <td className="pl-4 pr-2 py-3 w-8">
 <button
 {...attributes}
 {...listeners}
 className="text-black/25 hover:text-black/60 cursor-grab active:cursor-grabbing transition-colors p-1"
 aria-label="Drag to reorder"
 >
 <GripIcon />
 </button>
 </td>

 {/* Thumbnail */}
 <td className="py-3 pr-4 w-16">
 <div className="w-14 h-10 rounded overflow-hidden bg-neutral-100">
 <img src={post.imageUrl} alt=""className="w-full h-full object-cover"/>
 </div>
 </td>

 {/* Title */}
 <td className="py-3 pr-4">
 <p className="text-sm font-medium text-black leading-snug line-clamp-1 max-w-[280px]">
 {post.title}
 </p>
 <p className="text-xs text-black/35 mt-0.5">{post.slug}</p>
 </td>

 {/* Category */}
 <td className="py-3 pr-4 hidden md:table-cell">
 <span className="text-xs text-black/50 font-medium">{post.category ??"—"}</span>
 </td>

 {/* Date */}
 <td className="py-3 pr-4 hidden lg:table-cell">
 <span className="text-xs text-black/40">{post.date}</span>
 </td>

 {/* Status */}
 <td className="py-3 pr-4">
 <button
 onClick={() => onToggleStatus(post.id, post.status)}
 className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full transition-colors ${
 post.status ==="published"
 ?"bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
 :"bg-neutral-100 text-black/40 hover:bg-neutral-200"
}`}
 >
 {post.status ==="published"?"Published":"Draft"}
 </button>
 </td>

 {/* Actions */}
 <td className="py-3 pr-4">
 <div className="flex items-center gap-1">
 {/* Featured toggle */}
 <button
 onClick={() => onToggleFeatured(post.id, post.featured)}
 title={post.featured ?"Remove featured":"Set as featured"}
 className={`p-1.5 rounded-lg transition-colors ${
 post.featured
 ?"text-amber-500 bg-amber-50 hover:bg-amber-100"
 :"text-black/20 hover:text-black/50 hover:bg-neutral-100"
}`}
 >
 <StarIcon filled={post.featured} />
 </button>

 {/* Edit */}
 <Link
 to={`/admin/post/${post.slug}`}
 className="p-1.5 rounded-lg text-black/25 hover:text-black hover:bg-neutral-100 transition-colors"
 title="Edit post"
 >
 <EditIcon />
 </Link>

 {/* Delete */}
 <button
 onClick={() => onDelete(post.id, post.title)}
 className="p-1.5 rounded-lg text-black/20 hover:text-red-500 hover:bg-red-50 transition-colors"
 title="Delete post"
 >
 <TrashIcon />
 </button>
 </div>
 </td>
 </tr>
);
};

// ─── Dashboard ────────────────────────────────────────────

export const AdminDashboard = () => {
 const navigate = useNavigate();
 const { posts: rawPosts, loading, error, refetch} = useAllPostsAdmin();
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [signingOut, setSigningOut] = useState(false);
 const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string} | null>(null);
 const [saving, setSaving] = useState(false);

 // Sync posts from hook into local state for optimistic DnD reordering.
 // Only syncs when not in the middle of a drag (saving=false) to avoid
 // overwriting the user's optimistic reorder.
 useEffect(() => {
 if (!loading && !saving) {
 setPosts(rawPosts);
}
}, [rawPosts, loading]);


 const sensors = useSensors(
 useSensor(PointerSensor),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates})
);

 const handleDragEnd = async (event: DragEndEvent) => {
 const { active, over} = event;
 if (!over || active.id === over.id) return;

 const oldIndex = posts.findIndex((p) => p.id === active.id);
 const newIndex = posts.findIndex((p) => p.id === over.id);
 const reordered = arrayMove(posts, oldIndex, newIndex);

 // Optimistic update
 setPosts(reordered);
 setSaving(true);

 // Write new grid_order values to Supabase
 const updates = reordered.map((p, i) =>
 supabase.from("posts").update({ grid_order: i}).eq("id", p.id)
);
 await Promise.all(updates);
 setSaving(false);
};

 const handleToggleFeatured = async (id: string, current: boolean) => {
 // Optimistic update — DB trigger will clear others server-side
 setPosts((prev) =>
 prev.map((p) => ({ ...p, featured: p.id === id ? !current : false}))
);
 await supabase.from("posts").update({ featured: !current}).eq("id", id);
 refetch();
};

 const handleToggleStatus = async (
 id: string,
 current:"draft"|"published"
) => {
 const next:"draft"|"published"=
 current ==="published"?"draft":"published";
 setPosts((prev) =>
 prev.map((p) => (p.id === id ? { ...p, status: next} : p))
);
 await supabase.from("posts").update({ status: next}).eq("id", id);
};

 const handleDelete = async (id: string) => {
 setDeleteConfirm(null);
 setPosts((prev) => prev.filter((p) => p.id !== id));
 await supabase.from("posts").delete().eq("id", id);
};

 const handleSignOut = async () => {
 setSigningOut(true);
 await signOut();
 navigate("/admin/login", { replace: true});
};

 return (
 <div className="min-h-screen bg-[#f8f7f4]">
 {/* Top bar */}
 <header className="sticky top-0 z-40 bg-white border-b border-black/8 px-6 md:px-10 py-4 flex items-center justify-between">
 <div>
 <h1 className="text-[17px] font-semibold tracking-[-0.03em] text-black">
 Blog Dashboard
 </h1>
 <p className="text-xs text-black/35 mt-0.5">Parmar Properties Admin</p>
 </div>
 <div className="flex items-center gap-3">
 {saving && (
 <span className="text-xs text-black/40 flex items-center gap-1.5">
 <span className="w-3 h-3 border border-black/20 border-t-black/60 rounded-full animate-spin"/>
 Saving order…
 </span>
)}
 <Link
 to="/admin/post/new"
 id="admin-new-post-btn"
 className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-black/85 transition-colors"
 >
 <PlusIcon /> New Post
 </Link>
 <button
 onClick={handleSignOut}
 disabled={signingOut}
 className="text-sm text-black/40 hover:text-black transition-colors"
 >
 {signingOut ?"Signing out…":"Sign out"}
 </button>
 </div>
 </header>

 {/* Content */}
 <main className="max-w-[1200px] mx-auto px-6 md:px-10 py-10">
 {error && (
 <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
 Error loading posts: {error}
 </div>
)}

 <div className="bg-white rounded-2xl border border-black/8 shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden">
 {loading ? (
 <div className="p-10 flex items-center justify-center">
 <div className="w-6 h-6 border-2 border-black/15 border-t-black rounded-full animate-spin"/>
 </div>
) : posts.length === 0 ? (
 <div className="p-16 text-center">
 <p className="text-black/40 text-xl mb-4">No posts yet.</p>
 <Link
 to="/admin/post/new"
 className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-black/85 transition-colors"
 >
 <PlusIcon /> Create your first post
 </Link>
 </div>
) : (
 <div className="overflow-x-auto">
 <DndContext
 sensors={sensors}
 collisionDetection={closestCenter}
 onDragEnd={handleDragEnd}
 >
 <SortableContext
 items={posts.map((p) => p.id)}
 strategy={verticalListSortingStrategy}
 >
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-black/8">
 <th className="pl-4 pr-2 py-3 w-8"/>
 <th className="py-3 pr-4 w-16"/>
 <th className="py-3 pr-4 text-[10px] font-semibold uppercase tracking-wider text-black/35">Title</th>
 <th className="py-3 pr-4 text-[10px] font-semibold uppercase tracking-wider text-black/35 hidden md:table-cell">Category</th>
 <th className="py-3 pr-4 text-[10px] font-semibold uppercase tracking-wider text-black/35 hidden lg:table-cell">Date</th>
 <th className="py-3 pr-4 text-[10px] font-semibold uppercase tracking-wider text-black/35">Status</th>
 <th className="py-3 pr-4 text-[10px] font-semibold uppercase tracking-wider text-black/35">Actions</th>
 </tr>
 </thead>
 <tbody>
 {posts.map((post) => (
 <SortableRow
 key={post.id}
 post={post}
 onToggleFeatured={handleToggleFeatured}
 onToggleStatus={handleToggleStatus}
 onDelete={(id, title) => setDeleteConfirm({ id, title})}
 />
))}
 </tbody>
 </table>
 </SortableContext>
 </DndContext>
 </div>
)}
 </div>

 <p className="text-xs text-black/25 mt-4 text-center">
 Drag rows to reorder. Changes to grid order save automatically.
 </p>
 </main>

 {/* Delete confirm dialog */}
 {deleteConfirm && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
 <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl border border-black/8">
 <h3 className="text-[18px] font-semibold tracking-[-0.03em] mb-2">Delete post?</h3>
 <p className="text-sm text-black/55 mb-6 leading-relaxed">
"<span className="font-medium text-black">{deleteConfirm.title}</span>"will be permanently deleted. This cannot be undone.
 </p>
 <div className="flex gap-3">
 <button
 onClick={() => setDeleteConfirm(null)}
 className="flex-1 px-4 py-2.5 text-sm font-medium border border-black/15 rounded-xl hover:bg-neutral-50 transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={() => handleDelete(deleteConfirm.id)}
 className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
 >
 Delete
 </button>
 </div>
 </div>
 </div>
)}
 </div>
);
};
