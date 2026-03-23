export type EventTag = {
  id:      string
  eventId: string
  tag:     string
}

export type EventAgendaItem = {
  id:          string
  eventId:     string
  time:        string
  title:       string
  description: string | null
  speaker:     string | null
  order:       number
}

export type EventSummary = {
  id:          string
  title:       string
  slug:        string
  description: string
  type:        string
  location:    string
  locationType: string
  date:        string | Date
  badgeUrl:    string | null
  imageUrl:    string | null
  isPublished: boolean
  tags:        EventTag[]
  _count:      { registrations: number }
}

export type EventDetail = EventSummary & {
  agendaItems: EventAgendaItem[]
}
