export type Book = {
  shelfId?: number
} & VolumeResponse

export type Shelf = {
  id: number
  name: string
  books: Array<Book>
}

export type BookResponse = {
  items: Array<VolumeResponse>
  totalItems: number
  kind: 'books#volumes'
}

export interface VolumeResponse {
  kind: string
  id: string
  etag: string
  selfLink: string
  volumeInfo: {
    title: string
    authors: string[]
    publisher: string
    publishedDate: string
    description: string
    industryIdentifiers: Array<{
      type: string
      identifier: string
    }>
    pageCount: number
    dimensions: {
      height: string
      width: string
      thickness: string
    }
    printType: string
    mainCategory: string
    categories: string[]
    averageRating: number
    ratingsCount: number
    contentVersion: string
    imageLinks: {
      smallThumbnail: string
      thumbnail: string
      small: string
      medium: string
      large: string
      extraLarge: string
    }
    language: string
    infoLink: string
    canonicalVolumeLink: string
  }
  saleInfo: {
    country: string
    saleability: string
    isEbook: boolean
    listPrice: {
      amount: number
      currencyCode: string
    }
    retailPrice: {
      amount: number
      currencyCode: string
    }
    buyLink: string
  }
  accessInfo: {
    country: string
    viewability: string
    embeddable: boolean
    publicDomain: boolean
    textToSpeechPermission: string
    epub: {
      isAvailable: boolean
      acsTokenLink: string
    }
    pdf: {
      isAvailable: boolean
    }
    accessViewStatus: string
  }
}
