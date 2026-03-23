export type ResourceTrackStep = {
  id:          string
  trackId:     string
  stepNum:     string
  title:       string
  description: string
  order:       number
}

export type ResourceTrack = {
  id:          string
  name:        string
  tag:         string
  tagColor:    string
  description: string
  steps:       ResourceTrackStep[]
}

export type ResourcePlatform = {
  id:          string
  name:        string
  url:         string
  description: string
  order:       number
}

export type ResourceTool = {
  id:         string
  categoryId: string
  name:       string
  url:        string | null
  toolType:   string
  order:      number
}

export type ResourceToolCategory = {
  id:       string
  name:     string
  colorHex: string
  order:    number
  tools:    ResourceTool[]
}
