import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Book } from './types'

type Data = {
  shelves: Array<{
    id: number
    name: string
    books: Array<Book>
  }>
  addToShelf: (shelfId: number, book: Book) => void
}

export const useShelfStore = create(
  persist<Data>(
    (set) => ({
      shelves: [
        { id: 0, name: 'To Read', books: [] },
        { id: 1, name: 'Reading', books: [] },
        { id: 2, name: 'Read', books: [] },
      ],
      addToShelf(shelfId: number, book: Book) {
        set((state) => {
          let shelfToAdd = state.shelves.find((s) => s.id === shelfId)
          if (!shelfToAdd) return state
          shelfToAdd.books.push(book)
          return {
            shelves: [...state.shelves],
          }
        })
      },
    }),
    { name: 'books', storage: createJSONStorage(() => AsyncStorage) }
  )
)
