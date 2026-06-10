import { memo } from "react";
import type { User } from "../services/api";
import { Users } from "lucide-react";

export const UseList = memo(function UseList({ users }: { users: User[] }) {
    return (
        <div className="space-y-6">
            {/* Table Header with Title and Count Badge */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    <span>User Directory</span>
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30">
                    {users.length} {users.length === 1 ? "User" : "Users"}
                </span>
            </div>

            {/* Responsive Table Wrapper */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm text-slate-600 dark:text-slate-350">
                        <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold tracking-wider border-b border-slate-200/60 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-16">S.No</th>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80">
                            {users.map((user, index) => (
                                <tr 
                                    key={user.id || index}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-400 dark:text-slate-550">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-violet-55/10 dark:bg-violet-950/50 text-violet-650 dark:text-violet-400 flex items-center justify-center font-bold text-xs capitalize">
                                                {user.name ? user.name[0] : "U"}
                                            </div>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {user.name || "N/A"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30 capitalize">
                                            {user.role || "user"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }) : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});