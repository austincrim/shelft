import { useEffect, useState } from 'react'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import type { BookResponse } from '@/types'

export const BOOKS_API_URL = `https://www.googleapis.com/books/v1/volumes`
const BOOKS_PER_PAGE = 10

export function useBookSearch(search: string) {
  let debounced = useDebounce(search, 150)
  let result = useInfiniteQuery({
    queryKey: [debounced],
    placeholderData: keepPreviousData,
    queryFn: ({ queryKey, pageParam }) => {
      return fetch(
        BOOKS_API_URL +
          `?q=${queryKey}&startIndex=${
            pageParam * BOOKS_PER_PAGE
          }&maxResults=${BOOKS_PER_PAGE}`
      ).then((res) => res.json()) as any as Promise<BookResponse>
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPage.items?.length > 0 ? lastPageParam + 1 : undefined
    },
  })

  return result
}

export function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
