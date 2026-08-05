import { FiBriefcase, FiInfo, FiShield } from "react-icons/fi";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings &amp; Preferences</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your business appearance in the Motor Bridge Directory and keep your account secure with these
          core configuration options.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
            <FiBriefcase className="text-[15px] text-[#00663f]" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Business Profile</h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500">Business Name</label>
              <input
                type="text"
                defaultValue="Green Growth Co."
                className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#00663f]/30"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Category</label>
              <select
                defaultValue="Eco-friendly Landscaping"
                className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#00663f]/30"
              >
                <option>Eco-friendly Landscaping</option>
                <option>Garden Design</option>
                <option>Outdoor Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500">Brief Description</label>
            <textarea
              rows={5}
              defaultValue="Premium organic landscaping and sustainable outdoor living solutions for modern French estates. We specialize in native biodiversity and water-efficient garden designs that thrive in the local climate."
              className="mt-1.5 w-full resize-none rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">
          <button
            type="button"
            className="rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
            <FiShield className="text-[15px] text-[#00663f]" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Security</h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm text-slate-500">Current Password</label>
            <input
              type="password"
              defaultValue="password"
              className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">New Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">Confirm New Password</label>
            <input
              type="password"
              placeholder="Repeat new password"
              className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <FiInfo className="text-[13px] text-[#00663f]" />
            Password must include a mix of letters, numbers, and symbols.
          </p>
          <button
            type="button"
            className="rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
