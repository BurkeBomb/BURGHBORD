
export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Task Management</h1>
      <p className="text-white/80">Fast, tag-driven workflow for medical billing and operations.</p>
      <ul className="list-disc ml-6 text-white/80">
        <li>Create and assign tasks to staff</li>
        <li>Tag by scheme, doctor, patient, or category</li>
        <li>Track statuses: Open → In Progress → Awaiting Feedback → Closed</li>
        <li>Filter by tags and assignees</li>
      </ul>
    </div>
  )
}
