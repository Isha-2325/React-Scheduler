import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Ellipsis,
  Filter,
  LayoutGrid,
  ListFilter,
  Plus,
  Search,
  Settings2,
  Sparkles,
  SunMedium,
  RefreshCw,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'

const initialEvents = [
  { id: 1, title: 'Product design critique', type: 'Meeting', date: '2026-07-23', time: '10:30 AM', duration: '45 min', location: 'Studio 04', color: 'coral', reminder: true },
  { id: 2, title: 'Write July product update', type: 'Task', date: '2026-07-23', time: '2:00 PM', duration: '1 hr', location: 'Focus time', color: 'teal', reminder: false },
  { id: 3, title: 'Dentist appointment', type: 'Personal', date: '2026-07-24', time: '9:15 AM', duration: '1 hr', location: 'Northside Dental', color: 'yellow', reminder: true },
  { id: 4, title: 'Q3 planning workshop', type: 'Workshop', date: '2026-07-25', time: '11:00 AM', duration: '2 hr', location: 'The Commons', color: 'blue', reminder: true },
  { id: 5, title: 'Send partner invoices', type: 'Task', date: '2026-07-26', time: '4:30 PM', duration: '30 min', location: 'Finance', color: 'purple', reminder: false },
  { id: 6, title: 'Saturday morning run', type: 'Personal', date: '2026-07-27', time: '8:00 AM', duration: '1 hr', location: 'Riverside trail', color: 'green', reminder: false },
]

const week = [
  { label: 'Tue', date: '21', iso: '2026-07-21' },
  { label: 'Wed', date: '22', iso: '2026-07-22' },
  { label: 'Thu', date: '23', iso: '2026-07-23' },
  { label: 'Fri', date: '24', iso: '2026-07-24' },
  { label: 'Sat', date: '25', iso: '2026-07-25' },
  { label: 'Sun', date: '26', iso: '2026-07-26' },
  { label: 'Mon', date: '27', iso: '2026-07-27' },
]

const formatDay = (date) => new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(`${date}T12:00:00`))
const shortDay = (date) => new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))
const getInitials = (name) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

function App() {
  const [userName, setUserName] = useState(() => localStorage.getItem('orbit-user-name') || '')
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('orbit-user-email') || '')
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('orbit-events')
    if (savedEvents) return JSON.parse(savedEvents)
    return localStorage.getItem('orbit-user-name') ? initialEvents : []
  })
  const [selectedDate, setSelectedDate] = useState('2026-07-23')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showComposer, setShowComposer] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [view, setView] = useState('list')

  useEffect(() => {
    if (userName) localStorage.setItem('orbit-events', JSON.stringify(events))
  }, [events, userName])

  const visibleEvents = useMemo(() => events
    .filter((event) => filter === 'All' || event.type === filter)
    .filter((event) => `${event.title} ${event.location}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)), [events, filter, search])

  const selectedEvents = visibleEvents.filter((event) => event.date === selectedDate)
  const reminders = events.filter((event) => event.reminder).sort((a, b) => a.date.localeCompare(b.date))

  const toggleReminder = (id) => setEvents((current) => current.map((event) => event.id === id ? { ...event, reminder: !event.reminder } : event))
  const completeTask = (id) => setEvents((current) => current.filter((event) => event.id !== id))
  const saveEvent = (event) => {
    setEvents((current) => event.id
      ? current.map((item) => item.id === event.id ? { ...item, ...event } : item)
      : [...current, { ...event, id: Date.now(), color: event.type === 'Task' ? 'teal' : 'coral' }])
    setSelectedDate(event.date)
    setShowComposer(false)
    setEditingEvent(null)
  }
  const deleteEvent = (id) => setEvents((current) => current.filter((event) => event.id !== id))

  const signIn = (name, email) => {
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanName || !cleanEmail) return
    localStorage.setItem('orbit-user-name', cleanName)
    localStorage.setItem('orbit-user-email', cleanEmail)
    setEvents(initialEvents)
    setUserName(cleanName)
    setUserEmail(cleanEmail)
  }

  if (!userName || !userEmail) return <LoginScreen onSignIn={signIn} />

  const firstName = userName.split(' ')[0]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>orbit</span></div>
        <div className="workspace-switcher"><div className="avatar avatar-small">{getInitials(userName)}</div><div><strong>{userName}</strong><span>{userEmail}</span></div><ChevronDown size={15} /></div>
        <nav className="main-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          <button className="nav-item active"><CalendarDays size={18} /> Schedule <span className="nav-count">6</span></button>
          <button className="nav-item"><LayoutGrid size={18} /> Projects</button>
          <button className="nav-item"><ListFilter size={18} /> Tasks <span className="nav-count muted">3</span></button>
          <p className="nav-label space-top">Your calendars</p>
          <button className="calendar-link"><i className="dot coral-dot" /> Work</button>
          <button className="calendar-link"><i className="dot teal-dot" /> Personal</button>
          <button className="calendar-link"><i className="dot purple-dot" /> Birthdays</button>
        </nav>
        <div className="sidebar-bottom"><button className="nav-item"><Settings2 size={18} /> Settings</button><div className="upgrade-note"><span>Plan your week</span><strong>with less noise.</strong><button>Try focus mode <ChevronRight size={14} /></button></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="mobile-brand"><span className="brand-mark"><Sparkles size={16} /></span> orbit</div><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>Schedule</strong></div><div className="top-actions"><div className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search schedule" aria-label="Search schedule" /></div><button className="icon-button" aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button><div className="avatar">{getInitials(userName)}</div></div></header>
        <div className="content-wrap">
          <section className="page-heading"><div><div className="eyebrow"><SunMedium size={15} /> Thursday, July 23, 2026</div><h1>Good morning, {firstName}.</h1><p>Here is the shape of your day.</p></div><button className="primary-button" onClick={() => { setEditingEvent(null); setShowComposer(true) }}><Plus size={18} /> Add schedule</button></section>

          <section className="week-card" aria-label="Week calendar"><div className="week-heading"><div><span className="section-kicker">Your week</span><h2>July 21 – 27, 2026</h2></div><div className="week-actions"><button className="icon-button light" aria-label="Previous week"><ChevronLeft size={17} /></button><button className="today-button" onClick={() => setSelectedDate('2026-07-23')}>Today</button><button className="icon-button light" aria-label="Next week"><ChevronRight size={17} /></button></div></div><div className="week-grid">{week.map((day) => { const count = events.filter((event) => event.date === day.iso).length; return <button key={day.iso} className={`day-cell ${selectedDate === day.iso ? 'selected' : ''}`} onClick={() => setSelectedDate(day.iso)}><span>{day.label}</span><strong>{day.date}</strong>{count > 0 && <i className="day-event-dot" />}</button> })}</div></section>

          <div className="dashboard-grid"><section className="schedule-section"><div className="section-header"><div><span className="section-kicker">{selectedDate === '2026-07-23' ? 'Today' : 'Selected day'}</span><h2>{formatDay(selectedDate)}</h2></div><div className="view-switcher"><button className={view === 'list' ? 'selected' : ''} onClick={() => setView('list')} aria-label="List view"><ListFilter size={16} /></button><button className={view === 'grid' ? 'selected' : ''} onClick={() => setView('grid')} aria-label="Grid view"><LayoutGrid size={16} /></button></div></div><div className="filter-row"><div className="filter-tabs">{['All', 'Meeting', 'Task', 'Personal'].map((item) => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="filter-button"><Filter size={14} /> Filter</button></div>{selectedEvents.length === 0 ? <div className="empty-state"><CalendarDays size={28} /><strong>No schedules found</strong><span>Try another day or add something new.</span></div> : <div className={`event-list ${view === 'grid' ? 'grid-view' : ''}`}>{visibleEvents.map((event) => <EventCard key={event.id} event={event} onReminder={() => toggleReminder(event.id)} onComplete={() => completeTask(event.id)} onDelete={() => deleteEvent(event.id)} onReschedule={() => { setEditingEvent(event); setShowComposer(true) }} />)}</div>}</section>

            <aside className="reminder-panel"><div className="panel-heading"><div><span className="section-kicker">Stay ahead</span><h2>Reminders</h2></div><button className="icon-button light" aria-label="More reminder options"><Ellipsis size={18} /></button></div><div className="reminder-summary"><div className="summary-icon"><Bell size={18} /></div><div><strong>{reminders.length} active reminders</strong><span>Across the next 7 days</span></div></div><div className="reminder-list">{reminders.slice(0, 4).map((event) => <button className="reminder-item" key={event.id} onClick={() => { setSelectedDate(event.date); setFilter('All') }}><div className={`reminder-line ${event.color}`} /><div className="reminder-copy"><strong>{event.title}</strong><span>{event.date === '2026-07-23' ? 'Today' : shortDay(event.date)} at {event.time}</span></div><Bell size={15} className="reminder-bell" /></button>)}</div><button className="manage-button" onClick={() => setFilter('All')}>Manage reminders <ChevronRight size={15} /></button></aside>
          </div>
        </div>
      </main>
      {showComposer && <Composer key={editingEvent?.id || 'new'} event={editingEvent} onClose={() => { setShowComposer(false); setEditingEvent(null) }} onSave={saveEvent} />}
    </div>
  )
}

function LoginScreen({ onSignIn }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const submit = (event) => {
    event.preventDefault()
    onSignIn(name, email)
  }

  return <main className="login-screen"><div className="login-orbit orbit-one" /><div className="login-orbit orbit-two" /><form className="login-card" onSubmit={submit}><div className="login-brand"><span className="brand-mark"><Sparkles size={17} /></span><strong>orbit</strong></div><div className="login-icon"><UserRound size={23} /></div><span className="section-kicker">Your personal planning space</span><h1>Let’s make room<br />for what matters.</h1><p>Start with your name and email so we can personalize your schedule.</p><label>Your name<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Jordan Lee" /></label><label>Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><button className="primary-button" type="submit">Enter my schedule <ChevronRight size={17} /></button><small>Your details stay on this device.</small></form></main>
}

function EventCard({ event, onReminder, onComplete, onDelete, onReschedule }) {
  return <article className={`event-card ${event.color}`}><div className="event-time"><strong>{event.time}</strong><span>{event.duration}</span></div><div className="event-body"><div className="event-title-row"><h3>{event.title}</h3><span className="type-pill">{event.type}</span></div><p><Clock3 size={14} /> {event.location}</p></div><div className="event-actions">{event.type === 'Task' && <button className="complete-button" onClick={onComplete} aria-label={`Complete ${event.title}`} title="Complete task"><Check size={15} /></button>}<button className={`reminder-button ${event.reminder ? 'on' : ''}`} onClick={onReminder} aria-label={`${event.reminder ? 'Remove' : 'Set'} reminder for ${event.title}`} title={event.reminder ? 'Remove reminder' : 'Set reminder'}><Bell size={15} /></button><button className="reschedule-button" onClick={onReschedule} aria-label={`Reschedule ${event.title}`} title="Reschedule"><RefreshCw size={15} /></button><button className="delete-button" onClick={onDelete} aria-label={`Delete ${event.title}`} title="Delete"><Trash2 size={15} /></button></div></article>
}

function Composer({ event: existingEvent, onClose, onSave }) {
  const [title, setTitle] = useState(existingEvent?.title || '')
  const [type, setType] = useState(existingEvent?.type || 'Meeting')
  const [date, setDate] = useState(existingEvent?.date || '2026-07-23')
  const [time, setTime] = useState(existingEvent?.time || '3:00 PM')
  const [location, setLocation] = useState(existingEvent?.location || '')
  const [reminder, setReminder] = useState(existingEvent?.reminder ?? true)
  const submit = (formEvent) => { formEvent.preventDefault(); if (title.trim()) onSave({ id: existingEvent?.id, title: title.trim(), type, date, time, duration: type === 'Task' ? '30 min' : '1 hr', location: location.trim() || 'Unscheduled', reminder, color: existingEvent?.color }) }
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="composer" onSubmit={submit}><div className="composer-header"><div><span className="section-kicker">{existingEvent ? 'Edit entry' : 'New entry'}</span><h2>{existingEvent ? 'Reschedule event' : 'Add to your schedule'}</h2></div><button type="button" className="icon-button light" onClick={onClose} aria-label="Close"><X size={18} /></button></div><label>Title<input autoFocus required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs your attention?" /></label><div className="form-row"><label>Type<select value={type} onChange={(event) => setType(event.target.value)}><option>Meeting</option><option>Task</option><option>Personal</option><option>Workshop</option></select></label><label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label></div><div className="form-row"><label>Time<select value={time} onChange={(event) => setTime(event.target.value)}><option>9:00 AM</option><option>10:30 AM</option><option>12:00 PM</option><option>2:00 PM</option><option>3:00 PM</option><option>4:30 PM</option></select></label><label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Optional" /></label></div><label className="reminder-toggle"><input type="checkbox" checked={reminder} onChange={(event) => setReminder(event.target.checked)} /><span className="fake-checkbox"><Check size={13} /></span><span><strong>Set a reminder</strong><small>15 minutes before</small></span></label><div className="composer-footer"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">{existingEvent ? 'Save changes' : 'Add schedule'} <Plus size={17} /></button></div></form></div>
}

export default App
