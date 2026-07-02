import { UploadCloud } from "lucide-react";

const inputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  bg-[var(--color-background)]
  border border-[var(--color-border)]
  text-[var(--color-text-primary)]
  placeholder:text-[var(--color-text-secondary)]
  outline-none
  focus:border-[var(--color-primary-blue)]
  focus:ring-2 focus:ring-[rgba(0,102,255,0.2)]
  transition-colors duration-150
`.trim();

const labelCls = "text-sm font-medium text-[var(--color-text-primary)]";
const fieldCls = "flex flex-col gap-1.5";

export default function CreateEventPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Create event</h1>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 sm:px-8 py-8">
          <form className="flex flex-col gap-6">

            {/* Title */}
            <div className={fieldCls}>
              <label className={labelCls} htmlFor="title">Event title</label>
              <input id="title" type="text" placeholder="e.g. Full-Stack Web Dev Workshop" className={inputCls} />
            </div>

            {/* Description */}
            <div className={fieldCls}>
              <label className={labelCls} htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={5}
                placeholder="Describe your event — what attendees can expect, prerequisites, schedule, etc."
                className={`${inputCls} resize-y`}
              />
            </div>

            {/* Banner upload */}
            <div className={fieldCls}>
              <span className={labelCls}>Banner image</span>
              <div
                className="
                  w-full h-36 rounded-xl
                  border-2 border-dashed border-[var(--color-border)]
                  flex flex-col items-center justify-center gap-2
                  text-[var(--color-text-secondary)]
                  hover:border-[var(--color-primary-blue)]
                  hover:text-[var(--color-primary-blue)]
                  transition-colors duration-150
                  cursor-pointer
                "
              >
                <UploadCloud size={28} strokeWidth={1.5} />
                <span className="text-sm font-medium">Click to upload banner</span>
                <span className="text-xs">PNG, JPG up to 4MB</span>
              </div>
            </div>

            {/* Category + Event type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="category">Category</label>
                <select id="category" defaultValue="" className={`${inputCls} cursor-pointer`}>
                  <option value="" disabled>Select category</option>
                  <option>Workshop</option>
                  <option>Meetup</option>
                  <option>Conference</option>
                  <option>Hackathon</option>
                  <option>Career</option>
                  <option>Networking</option>
                  <option>Competition</option>
                </select>
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="event-type">Event type</label>
                <select id="event-type" defaultValue="" className={`${inputCls} cursor-pointer`}>
                  <option value="" disabled>Select type</option>
                  <option>In-person</option>
                  <option>Virtual</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>

            {/* Venue */}
            <div className={fieldCls}>
              <label className={labelCls} htmlFor="venue">Venue</label>
              <input id="venue" type="text" placeholder="e.g. Tech Hub, Lahore or Virtual (Zoom)" className={inputCls} />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="event-date">Date</label>
                <input id="event-date" type="date" className={inputCls} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="event-time">Time</label>
                <input id="event-time" type="time" className={inputCls} />
              </div>
            </div>

            {/* Capacity + Registration deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="capacity">Capacity</label>
                <input id="capacity" type="number" min={1} placeholder="e.g. 100" className={inputCls} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="deadline">Registration deadline</label>
                <input id="deadline" type="date" className={inputCls} />
              </div>
            </div>

            {/* Approval mode */}
            <div className={fieldCls}>
              <span className={labelCls}>Approval mode</span>
              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                {[
                  { id: "auto",   value: "auto",   label: "Auto approval",   desc: "Registrations are approved instantly" },
                  { id: "manual", value: "manual", label: "Manual approval",  desc: "You review and approve each registration" },
                ].map(({ id, value, label, desc }) => (
                  <label
                    key={id}
                    htmlFor={id}
                    className="
                      flex-1 flex items-start gap-3
                      p-4 rounded-xl cursor-pointer
                      border border-[var(--color-border)]
                      hover:border-[var(--color-primary-blue)]
                      transition-colors duration-150
                    "
                  >
                    <input
                      id={id}
                      type="radio"
                      name="approval"
                      value={value}
                      defaultChecked={value === "auto"}
                      className="mt-0.5 accent-[#0066ff]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[var(--color-border)]">
              <button
                type="button"
                className="
                  flex-1 py-2.5 rounded-full text-sm font-semibold
                  text-[var(--color-text-primary)]
                  border border-[var(--color-border)]
                  hover:border-[var(--color-primary-blue)]
                  hover:text-[var(--color-primary-blue)]
                  bg-transparent transition duration-150 cursor-pointer
                "
              >
                Save as draft
              </button>
              <button
                type="submit"
                className="
                  flex-1 py-2.5 rounded-full text-sm font-semibold text-white
                  bg-[var(--color-primary-blue)]
                  hover:opacity-90 transition duration-150
                  shadow-lg shadow-[rgba(0,102,255,0.2)] cursor-pointer
                "
              >
                Publish event
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
