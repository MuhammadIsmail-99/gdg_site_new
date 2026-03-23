export type PostAuthor = {
  name:      string
  slug:      string
  imageUrl:  string | null
  role:      string
  tier:      string | null
  bio?:      string | null
  linkedin?: string | null
  github?:   string | null
}

export type PostTag = {
  id:     string
  postId: string
  tag:    string
}

export type PostSummary = {
  id:          string
  title:       string
  slug:        string
  excerpt:     string | null
  coverImage:  string | null
  isPublished: boolean
  createdAt:   string
  updatedAt:   string
  tags:        PostTag[]
  author:      PostAuthor
}

export type PostDetail = PostSummary & {
  body: string
}
