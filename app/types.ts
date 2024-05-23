export type BookResponse = {
  items: Array<Book>
  totalItems: number
  kind: 'books#volumes'
}

export type Book = {
  id: string
  volumeInfo: {
    title: string
    authors: Array<string>
    averageRating: number
    ratingsCount: number
    imageLinks: {
      smallThumbnail: string
      thumbnail: string
    }
  }
}
