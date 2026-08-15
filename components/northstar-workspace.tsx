'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Filter,
  Flag,
  Gauge,
  LayoutDashboard,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

const members = [
  { name: 'Maya Chen', role: 'Product lead', focus: 'Scope, decisions, executive updates', initials: 'MC', tone: 'bg-amber-100 text-amber-800' },
  { name: 'Jon Bell', role: 'Support lead', focus: 'Customer intents, escalation rules', initials: 'JB', tone: 'bg-sky-100 text-sky-800' },
  { name: 'Priya Nair', role: 'CX researcher', focus: 'Top contacts, language, test plan', initials: 'PN', tone: 'bg-rose-100 text-rose-800' },
  { name: 'Leo Park', role: 'Engineer', focus: 'Intent routing, instrumentation', initials: 'LP', tone: 'bg-violet-100 text-violet-800' },
  { name: 'Sam Ortiz', role: 'Operations', focus: 'Knowledge base, rollout readiness', initials: 'SO', tone: 'bg-emerald-100 text-emerald-800' },
]

type Status = 'Backlog' | 'To Do' | 'In Progress' | 'Review' | 'Done'
type Priority = 'High' | 'Medium' | 'Low'
type Task = { id: number; title: string; description: string; owner: string; priority: Priority; hours: number; dod: string; status: Status }

const seedTasks: Task[] = [
  { id: 1, title: 'Map order status intents', description: 'Group the last 30 days of contacts into a concise set of customer language patterns.', owner: 'Priya Nair', priority: 'High', hours: 3, dod: 'Top 5 order-status intents are documented with example phrases.', status: 'Done' },
  { id: 2, title: 'Draft order tracking response', description: 'Write the first self-serve response for customers asking where an order is.', owner: 'Jon Bell', priority: 'High', hours: 2, dod: 'Response passes support lead review and links to tracking.', status: 'Review' },
  { id: 3, title: 'Define refund eligibility rules', description: 'Translate current policy into plain-language decision points for the MVP.', owner: 'Jon Bell', priority: 'High', hours: 4, dod: 'Rules cover timing, payment method, and exception paths.', status: 'In Progress' },
  { id: 4, title: 'Audit returns macro language', description: 'Review existing saved replies for ambiguity and outdated policy references.', owner: 'Sam Ortiz', priority: 'Medium', hours: 2, dod: 'All return macros have an owner and an approved source link.', status: 'In Progress' },
  { id: 5, title: 'Create stock availability intent', description: 'Add common availability questions and the fallback when inventory is unknown.', owner: 'Leo Park', priority: 'High', hours: 3, dod: 'Intent is routed with a reliable fallback and event logged.', status: 'To Do' },
  { id: 6, title: 'Select MVP knowledge sources', description: 'Choose the policy and catalog sources the support experience can safely reference.', owner: 'Maya Chen', priority: 'Medium', hours: 2, dod: 'Source list is approved and every item has a freshness owner.', status: 'To Do' },
  { id: 7, title: 'Instrument deflection events', description: 'Track resolved, escalated, and abandoned sessions for the pilot cohort.', owner: 'Leo Park', priority: 'Medium', hours: 4, dod: 'Dashboard events are visible for all three outcome states.', status: 'Backlog' },
  { id: 8, title: 'Write escalation handoff', description: 'Define when automation should stop and what context support receives.', owner: 'Sam Ortiz', priority: 'High', hours: 3, dod: 'Handoff includes intent, customer message, and recommended next action.', status: 'Backlog' },
  { id: 9, title: 'Recruit pilot agents', description: 'Identify two support agents to test response quality and edge cases.', owner: 'Priya Nair', priority: 'Low', hours: 2, dod: 'Two agents confirm pilot availability for Thursday.', status: 'Backlog' },
  { id: 10, title: 'Run launch readiness review', description: 'Walk the team through the MVP boundary, known gaps, and rollback plan.', owner: 'Maya Chen', priority: 'High', hours: 2, dod: 'Team signs off on pilot scope and rollback owner.', status: 'Backlog' },
]

const columns: Status[] = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done']
const nav = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Team Charter', icon: Users },
  { label: 'Project Board', icon: ClipboardCheck },
]

function Avatar({ name, className = '' }: { name: string; className?: string }) {
  const member = members.find((person) => person.name === name)
  return <span className={`inline-flex size-7 items-center justify-center rounded-full text-[10px] font-bold ${member?.tone ?? 'bg-muted text-muted-foreground'} ${className}`}>{member?.initials ?? name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge variant="outline" className={priority === 'High' ? 'border-red-200 bg-red-50 text-red-700' : priority === 'Medium' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-slate-50 text-slate-600'}>{priority}</Badge>
}

function StatCard({ label, value, note, icon: Icon, accent }: { label: string; value: string; note: string; icon: typeof Target; accent: string }) {
  return <Card className="border-border/70 shadow-sm"><CardContent className="flex items-start justify-between p-5"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div><span className={`flex size-10 items-center justify-center rounded-xl ${accent}`}><Icon className="size-5" /></span></CardContent></Card>
}

export function NorthstarWorkspace() {
  const [view, setView] = useState('Dashboard')
  const [tasks, setTasks] = useState<Task[]>(seedTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskDialog, setTaskDialog] = useState(false)
  const [search, setSearch] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('All owners')
  const [priorityFilter, setPriorityFilter] = useState('All priorities')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [newTask, setNewTask] = useState<Partial<Task>>({ status: 'Backlog', hours: 2 })
  const [charterMembers, setCharterMembers] = useState(members)

  useEffect(() => {
    const savedTasks = window.localStorage.getItem('northstar-tasks')
    const savedMembers = window.localStorage.getItem('northstar-members')
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedMembers) setCharterMembers(JSON.parse(savedMembers))
  }, [])

  useEffect(() => { window.localStorage.setItem('northstar-tasks', JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { window.localStorage.setItem('northstar-members', JSON.stringify(charterMembers)) }, [charterMembers])

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesText = `${task.title} ${task.description} ${task.owner}`.toLowerCase().includes(search.toLowerCase())
    return matchesText && (ownerFilter === 'All owners' || task.owner === ownerFilter) && (priorityFilter === 'All priorities' || task.priority === priorityFilter) && (statusFilter === 'All statuses' || task.status === statusFilter)
  }), [tasks, search, ownerFilter, priorityFilter, statusFilter])

  const completed = tasks.filter((task) => task.status === 'Done').length
  const inFlight = tasks.filter((task) => task.status === 'In Progress' || task.status === 'Review').length
  const totalHours = tasks.reduce((total, task) => total + task.hours, 0)

  function moveTask(id: number, status: Status) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task))
    toast.success(`Task moved to ${status}`)
  }

  function saveTask() {
    const title = newTask.title?.trim()
    const owner = newTask.owner
    const priority = newTask.priority
    const dod = newTask.dod?.trim()
    const hours = Number(newTask.hours)
    if (!title || !owner || !priority || !dod || !newTask.description?.trim()) return toast.error('Add a title, description, owner, priority, effort, and Definition of Done.')
    if (hours > 4 || hours <= 0) return toast.error('Effort must be between 1 and 4 hours.')
    const task: Task = { id: Date.now(), title, description: newTask.description, owner, priority, hours, dod, status: newTask.status as Status ?? 'Backlog' }
    setTasks((current) => [...current, task])
    setTaskDialog(false)
    setNewTask({ status: 'Backlog', hours: 2 })
    toast.success('Task added to the project board')
  }

  function updateMember(index: number, field: 'name' | 'role' | 'focus', value: string) {
    setCharterMembers((current) => current.map((member, i) => i === index ? { ...member, [field]: value } : member))
  }

  return <div className="min-h-screen bg-[#f7f8f6] text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border/70 bg-white lg:flex">
      <div className="flex h-20 items-center gap-3 border-b border-border/70 px-6"><div className="flex size-9 items-center justify-center rounded-xl bg-[#e86f51] text-white shadow-sm"><Sparkles className="size-5" /></div><div><p className="text-[15px] font-bold tracking-tight">northstar</p><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">PRIDE workspace</p></div></div>
      <div className="flex flex-1 flex-col justify-between p-4"><nav className="flex flex-col gap-1">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => setView(label)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${view === label ? 'bg-[#fff0eb] text-[#c64d32]' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon className="size-4" />{label}{label === 'Project Board' && <Badge className="ml-auto bg-[#e86f51] px-1.5 text-[10px] text-white">{tasks.length}</Badge>}</button>)}</nav><div className="flex flex-col gap-1"><button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><Settings2 className="size-4" />Workspace settings</button><div className="mt-4 flex items-center gap-3 rounded-xl border border-border/70 bg-[#fafaf8] p-3"><Avatar name="Maya Chen" /><div className="min-w-0"><p className="truncate text-xs font-semibold">Maya Chen</p><p className="truncate text-[11px] text-muted-foreground">Product lead</p></div><MoreHorizontal className="ml-auto size-4 text-muted-foreground" /></div></div></div>
    </aside>
    <main className="min-h-screen lg:pl-64">
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border/70 bg-[#f7f8f6]/90 px-5 backdrop-blur-md sm:px-8"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d45b3d]">Northstar / {view}</p><h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Support deflection MVP</h1></div><div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Help"><CircleHelp className="size-4" /></Button><Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="size-4" /></Button><Button onClick={() => setTaskDialog(true)} className="bg-[#e86f51] text-white hover:bg-[#d75d40]"><Plus data-icon="inline-start" />New task</Button></div></header>
      <div className="mx-auto max-w-[1500px] p-5 sm:p-8">{view === 'Dashboard' && <Dashboard completed={completed} inFlight={inFlight} totalHours={totalHours} tasks={tasks} setView={setView} />}{view === 'Team Charter' && <Charter charterMembers={charterMembers} updateMember={updateMember} />}{view === 'Project Board' && <Board tasks={filteredTasks} allTasks={tasks} search={search} setSearch={setSearch} ownerFilter={ownerFilter} setOwnerFilter={setOwnerFilter} priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} moveTask={moveTask} setSelectedTask={setSelectedTask} setTaskDialog={setTaskDialog} />}</div>
    </main>
    <Toaster position="bottom-right" />
    <TaskDialog open={taskDialog} setOpen={setTaskDialog} task={newTask} setTask={setNewTask} saveTask={saveTask} />
    <TaskSheet task={selectedTask} setTask={setSelectedTask} moveTask={moveTask} />
  </div>
}

function Dashboard({ completed, inFlight, totalHours, tasks, setView }: { completed: number; inFlight: number; totalHours: number; tasks: Task[]; setView: (view: string) => void }) {
  return <div className="flex flex-col gap-7"><section className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><Badge className="mb-3 bg-[#e86f51] text-white">Week 1 / Discovery sprint</Badge><h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">A small team, a clear signal, one week to learn.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Keep the work grounded in the PRIDE framework: make the purpose visible, decisions explicit, and execution small enough to finish.</p></div><Button variant="outline" onClick={() => setView('Project Board')}>Open project board <ArrowRight data-icon="inline-end" /></Button></section><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Tasks complete" value={`${completed}/${tasks.length}`} note="One-week MVP scope" icon={CheckCircle2} accent="bg-emerald-100 text-emerald-700" /><StatCard label="In flight" value={`${inFlight}`} note="Needs team attention" icon={Activity} accent="bg-amber-100 text-amber-700" /><StatCard label="Planned effort" value={`${totalHours}h`} note="All tasks are <= 4h" icon={Gauge} accent="bg-sky-100 text-sky-700" /><StatCard label="Team size" value="5" note="Shared ownership" icon={Users} accent="bg-violet-100 text-violet-700" /></div><div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]"><Card className="border-border/70 shadow-sm"><CardHeader className="flex flex-row items-start justify-between"><div><CardTitle className="text-base">MVP scope</CardTitle><CardDescription>Three customer moments worth making easier this week.</CardDescription></div><Target className="size-5 text-[#e86f51]" /></CardHeader><CardContent><div className="grid gap-3 md:grid-cols-3">{[['01','Order status','Give customers a clear next step without waiting.'],['02','Returns & refunds','Translate policy into a confident answer.'],['03','Stock availability','Set the right expectation when inventory shifts.']].map(([number, title, copy]) => <div key={title} className="rounded-xl border border-border/70 bg-[#fafaf8] p-4"><span className="font-mono text-xs font-bold text-[#e86f51]">{number}</span><p className="mt-5 text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{copy}</p></div>)}</div></CardContent></Card><Card className="border-border/70 shadow-sm"><CardHeader><CardTitle className="text-base">Recent activity</CardTitle><CardDescription>What is moving the work forward.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">{tasks.slice(0, 4).map((task) => <div className="flex items-start gap-3" key={task.id}><Avatar name={task.owner} /><div className="min-w-0 flex-1"><p className="text-sm leading-5"><span className="font-semibold">{task.owner.split(' ')[0]}</span> updated <span className="font-medium">{task.title.toLowerCase()}</span></p><p className="mt-0.5 text-xs text-muted-foreground">{task.status} · {task.hours}h planned</p></div><PriorityBadge priority={task.priority} /></div>)}</CardContent></Card></div><Card className="border-border/70 shadow-sm"><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle className="text-base">PRIDE operating model</CardTitle><CardDescription>The shared language for how this team works.</CardDescription></div><Button variant="ghost" size="sm" onClick={() => setView('Team Charter')}>View charter <ArrowRight data-icon="inline-end" /></Button></CardHeader><CardContent className="grid gap-3 sm:grid-cols-5">{[['P','Purpose','Why this matters'],['R','Requirements','What must be true'],['I','Inputs','What we know'],['D','Decisions','What we choose'],['E','Execution','What ships']].map(([letter, title, copy]) => <div key={letter} className="flex gap-3 rounded-lg p-2"><span className="font-mono text-lg font-bold text-[#e86f51]">{letter}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs text-muted-foreground">{copy}</p></div></div>)}</CardContent></Card></div>
}

function Charter({ charterMembers, updateMember }: { charterMembers: typeof members; updateMember: (index: number, field: 'name' | 'role' | 'focus', value: string) => void }) {
  return <div className="flex flex-col gap-7"><section><Badge className="mb-3 bg-[#e86f51] text-white">Team agreement</Badge><h2 className="text-3xl font-semibold tracking-tight">Team Charter</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">A lightweight agreement for making decisions quickly, staying accountable, and protecting the one-week scope.</p></section><div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]"><Card className="border-border/70 shadow-sm"><CardHeader><CardTitle className="text-base">Who is in the room</CardTitle><CardDescription>Edit names, roles, and focus areas as the team takes shape.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{charterMembers.map((member, index) => <div className="grid gap-3 rounded-xl border border-border/70 bg-[#fafaf8] p-4 md:grid-cols-[auto_1fr_1fr_1.5fr] md:items-center" key={`${member.name}-${index}`}><Avatar name={member.name} className="size-9" /><div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</Label><Input value={member.name} onChange={(event) => updateMember(index, 'name', event.target.value)} className="mt-1 h-8 border-0 bg-transparent px-0 text-sm font-semibold shadow-none focus-visible:ring-0" /></div><div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Role</Label><Input value={member.role} onChange={(event) => updateMember(index, 'role', event.target.value)} className="mt-1 h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0" /></div><div><Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Focus</Label><Input value={member.focus} onChange={(event) => updateMember(index, 'focus', event.target.value)} className="mt-1 h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0" /></div></div>)}</CardContent></Card><div className="flex flex-col gap-5"><Card className="border-border/70 shadow-sm"><CardHeader><CardTitle className="text-base">Working rules</CardTitle></CardHeader><CardContent className="flex flex-col gap-4 text-sm">{[['Communication','Async first. Use the daily standup for blockers, not status theater.'],['Deadline','A task is not ready until its single Definition of Done is checkable.'],['Conflict','Name the tradeoff, make the smallest reversible decision, then move.'],['Escalation','Maya is the decision owner when scope or customer risk is unclear.']].map(([title, copy]) => <div key={title}><p className="font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{copy}</p></div>)}</CardContent></Card><Card className="border-[#f4c2b6] bg-[#fff6f2] shadow-sm"><CardContent className="flex gap-3 p-5"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#d45b3d]" /><div><p className="text-sm font-semibold">Approval gate</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Pilot scope is approved when support, product, and engineering can name what we will not solve this week.</p><Button variant="outline" size="sm" className="mt-4 bg-white"><Check data-icon="inline-start" />Mark approved</Button></div></CardContent></Card></div></div></div>
}

function Board({ tasks, allTasks, search, setSearch, ownerFilter, setOwnerFilter, priorityFilter, setPriorityFilter, statusFilter, setStatusFilter, moveTask, setSelectedTask, setTaskDialog }: { tasks: Task[]; allTasks: Task[]; search: string; setSearch: (value: string) => void; ownerFilter: string; setOwnerFilter: (value: string) => void; priorityFilter: string; setPriorityFilter: (value: string) => void; statusFilter: string; setStatusFilter: (value: string) => void; moveTask: (id: number, status: Status) => void; setSelectedTask: (task: Task) => void; setTaskDialog: (open: boolean) => void }) {
  return <div className="flex flex-col gap-6"><section className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Badge className="mb-3 bg-[#e86f51] text-white">Execution view</Badge><h2 className="text-3xl font-semibold tracking-tight">Project Board</h2><p className="mt-2 text-sm text-muted-foreground">Granular work only: every card can be finished in four hours or less.</p></div><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{tasks.length} visible tasks</span><Button onClick={() => setTaskDialog(true)}><Plus data-icon="inline-start" />Add task</Button></div></section><Card className="border-border/70 shadow-sm"><CardContent className="flex flex-col gap-3 p-4 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks, descriptions, owners..." className="pl-9" /></div><Filter className="hidden size-4 self-center text-muted-foreground lg:block" /><FilterSelect value={ownerFilter} onValueChange={setOwnerFilter} items={['All owners', ...members.map((member) => member.name)]} /><FilterSelect value={priorityFilter} onValueChange={setPriorityFilter} items={['All priorities', 'High', 'Medium', 'Low']} /><FilterSelect value={statusFilter} onValueChange={setStatusFilter} items={['All statuses', ...columns]} /></CardContent></Card><div className="flex gap-4 overflow-x-auto pb-4">{columns.map((column) => <div className="flex min-w-[280px] flex-1 flex-col gap-3" key={column}><div className="flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className={`size-2 rounded-full ${column === 'Done' ? 'bg-emerald-500' : column === 'In Progress' ? 'bg-amber-500' : column === 'Review' ? 'bg-violet-500' : 'bg-slate-300'}`} /><h3 className="text-sm font-semibold">{column}</h3><span className="text-xs text-muted-foreground">{tasks.filter((task) => task.status === column).length}</span></div><Button variant="ghost" size="icon" className="size-7" aria-label={`Add task to ${column}`} onClick={() => setTaskDialog(true)}><Plus className="size-3.5" /></Button></div><div className="flex min-h-36 flex-col gap-3 rounded-xl bg-[#ecefeb] p-2">{tasks.filter((task) => task.status === column).map((task) => <button key={task.id} onClick={() => setSelectedTask(task)} className="rounded-lg border border-border/70 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"><div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold leading-5">{task.title}</p><MoreHorizontal className="size-4 shrink-0 text-muted-foreground" /></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{task.description}</p><div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-2"><Avatar name={task.owner} /><span className="max-w-20 truncate text-[11px] font-medium">{task.owner.split(' ')[0]}</span></div><div className="flex items-center gap-1.5"><PriorityBadge priority={task.priority} /><span className="font-mono text-[10px] text-muted-foreground">{task.hours}h</span></div></div></button>)}</div></div>)}</div><div className="flex items-center gap-2 text-xs text-muted-foreground"><BarChart3 className="size-4" /> Showing {tasks.length} of {allTasks.length} tasks <span className="ml-auto">Tip: click a card to inspect its Definition of Done.</span></div></div>
}

function FilterSelect({ value, onValueChange, items }: { value: string; onValueChange: (value: string) => void; items: string[] }) { return <Select value={value} onValueChange={onValueChange}><SelectTrigger className="w-full lg:w-40"><SelectValue /></SelectTrigger><SelectContent>{items.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select> }

function TaskDialog({ open, setOpen, task, setTask, saveTask }: { open: boolean; setOpen: (open: boolean) => void; task: Partial<Task>; setTask: (task: Partial<Task>) => void; saveTask: () => void }) { return <Dialog open={open} onOpenChange={setOpen}><DialogContent className="sm:max-w-[560px]"><DialogHeader><DialogTitle>Add a granular task</DialogTitle><DialogDescription>Keep the work small, owned, and testable. Effort cannot exceed four hours.</DialogDescription></DialogHeader><div className="grid gap-4 py-2"><div className="grid gap-2"><Label htmlFor="task-title">Title</Label><Input id="task-title" value={task.title ?? ''} onChange={(event) => setTask({ ...task, title: event.target.value })} placeholder="e.g. Review top return questions" /></div><div className="grid gap-2"><Label htmlFor="task-description">Description</Label><Textarea id="task-description" value={task.description ?? ''} onChange={(event) => setTask({ ...task, description: event.target.value })} placeholder="What is the smallest useful slice?" /></div><div className="grid gap-4 sm:grid-cols-3"><div className="grid gap-2"><Label>Owner</Label><Select value={task.owner} onValueChange={(value) => setTask({ ...task, owner: value })}><SelectTrigger><SelectValue placeholder="Assign" /></SelectTrigger><SelectContent>{members.map((member) => <SelectItem key={member.name} value={member.name}>{member.name}</SelectItem>)}</SelectContent></Select></div><div className="grid gap-2"><Label>Priority</Label><Select value={task.priority} onValueChange={(value) => setTask({ ...task, priority: value as Priority })}><SelectTrigger><SelectValue placeholder="Set" /></SelectTrigger><SelectContent>{['High', 'Medium', 'Low'].map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}</SelectContent></Select></div><div className="grid gap-2"><Label htmlFor="task-hours">Effort (hours)</Label><Input id="task-hours" type="number" min="1" max="4" value={task.hours ?? 2} onChange={(event) => setTask({ ...task, hours: Number(event.target.value) })} /></div></div><div className="grid gap-2"><Label htmlFor="task-dod">Definition of Done</Label><Textarea id="task-dod" value={task.dod ?? ''} onChange={(event) => setTask({ ...task, dod: event.target.value })} placeholder="One checkable outcome" /></div></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={saveTask} className="bg-[#e86f51] text-white hover:bg-[#d75d40]">Create task</Button></DialogFooter></DialogContent></Dialog> }

function TaskSheet({ task, setTask, moveTask }: { task: Task | null; setTask: (task: Task | null) => void; moveTask: (id: number, status: Status) => void }) { return <Sheet open={!!task} onOpenChange={(open) => !open && setTask(null)}><SheetContent><SheetHeader><SheetTitle>{task?.title}</SheetTitle><SheetDescription>Task details and Definition of Done</SheetDescription></SheetHeader>{task && <div className="flex flex-col gap-6 p-6"><div className="flex items-center gap-2"><Avatar name={task.owner} /><span className="text-sm font-medium">{task.owner}</span><PriorityBadge priority={task.priority} /></div><p className="text-sm leading-6 text-muted-foreground">{task.description}</p><div className="rounded-xl border border-border/70 bg-[#fafaf8] p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Definition of Done</p><div className="mt-3 flex gap-3 text-sm leading-6"><span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded border border-[#e86f51] text-[#e86f51]"><Check className="size-3" /></span>{task.dod}</div></div><div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Status</p><p className="mt-1 font-semibold">{task.status}</p></div><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Effort</p><p className="mt-1 font-semibold">{task.hours} hours</p></div></div><div className="flex flex-col gap-2"><Label>Move task</Label><Select value={task.status} onValueChange={(value) => { moveTask(task.id, value as Status); setTask({ ...task, status: value as Status }) }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{columns.map((column) => <SelectItem key={column} value={column}>{column}</SelectItem>)}</SelectContent></Select></div><Button variant="outline" onClick={() => setTask(null)}>Close</Button></div>}</SheetContent></Sheet> }
