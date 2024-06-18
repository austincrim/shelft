import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Book, Shelf } from '@/types'

export const API_URL = 'http://192.168.8.181:8000'
function fetchApi(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}/${path}`, { ...options })
}

type Data = {
  shelves: Array<Shelf>
  addToShelf: (shelfId: number, book: Book) => void
  removeFromShelf: (shelfId: number, book: Book) => void
  moveBook: ({
    fromShelfId,
    toShelfId,
    book,
  }: {
    fromShelfId: number
    toShelfId: number
    book: Book
  }) => void
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
          if (shelfToAdd.books.findIndex((b) => b.id === book.id) > 0)
            return state
          shelfToAdd.books.push({ ...book, shelfId })
          return {
            shelves: [...state.shelves],
          }
        })
      },
      removeFromShelf(shelfId: number, book: Book) {
        set((state) => {
          let shelfToRemove = state.shelves.find((s) => s.id === shelfId)
          if (!shelfToRemove) return state
          shelfToRemove.books = shelfToRemove.books.filter(
            (b) => b.id !== book.id
          )
          return {
            shelves: [...state.shelves],
          }
        })
      },
      moveBook({
        fromShelfId,
        toShelfId,
        book,
      }: {
        fromShelfId: number
        toShelfId: number
        book: Book
      }) {
        let fromShelf = this.shelves.find((s) => s.id === fromShelfId)
        let toShelf = this.shelves.find((s) => s.id === toShelfId)
        if (!fromShelf || !toShelf) return
        if (toShelf.books.find((b) => b.id === book.id)) return

        this.removeFromShelf(fromShelfId, book)
        this.addToShelf(toShelfId, book)
      },
    }),
    { name: 'books', storage: createJSONStorage(() => AsyncStorage) }
  )
)

type UserStore = {
  csrf: string | null
  pat: string | null
  user: {
    id: string | null
    email: string | null
    name: string | null
  }
  fetchCsrf: () => Promise<void>
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      csrf: null,
      pat: null,
      user: {
        id: null,
        email: null,
        name: null,
      },
      async fetchCsrf() {
        try {
          let res = await fetchApi('/sanctum/csrf-cookie')
          console.log(res.headers.get('Set-Cookie'))
          let token = res.headers
            .getSetCookie()
            .find((c) => c.startsWith('XSRF-TOKEN='))
            ?.split('=')[1]
          set({ csrf: token })
        } catch (e) {
          console.error('could not fetch csrf', e)
        }
      },
    }),
    { name: 'user', storage: createJSONStorage(() => AsyncStorage) }
  )
)
