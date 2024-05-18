import { useEffect, useState } from 'react'
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'

const API_URL = `https://www.googleapis.com/books/v1/volumes`
const BOOKS_PER_PAGE = 10

let styles = StyleSheet.create({
  screen: {
    display: 'flex',
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: { fontSize: 32 },
  input: {
    borderBottomWidth: 2,
    fontSize: 20,
    marginTop: 32,
    padding: 8,
    width: '100%',
  },
  bookRow: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookText: {
    flexShrink: 1,
    maxWidth: '85%',
  },
})

type BookResponse = {
  items: Array<Book>
  totalItems: number
  kind: 'books#volumes'
}

type Book = {
  id: string
  volumeInfo: {
    title: string
    authors: Array<string>
    averageRating: number
    imageLinks: {
      smallThumbnail: string
      thumbnail: string
    }
  }
}

export default function Home() {
  let [search, setSearch] = useState('')
  let debounced = useDebounce(search, 150)
  let { data, fetchNextPage, status, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [debounced],
      queryFn: ({ queryKey, pageParam }) => {
        return fetch(
          API_URL +
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

  return (
    <SafeAreaView style={styles.screen}>
      <TextInput
        placeholder="Search books..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />
      <View style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {status === 'success' ? (
          <FlatList
            data={data?.pages.flatMap((page) => page.items)}
            renderItem={({ item }) => <BookRow book={item} />}
            keyExtractor={(book) => book?.id}
            onEndReached={() => !isFetching && fetchNextPage()}
          />
        ) : status === 'pending' ? (
          <Text>Loading...</Text>
        ) : (
          <Text>No books found</Text>
        )}
        {isFetchingNextPage && <ActivityIndicator />}
      </View>
    </SafeAreaView>
  )
}

function BookRow({ book }: { book: Book }) {
  if (!book) return <></>
  let volume = book.volumeInfo
  return (
    <View style={styles.bookRow}>
      <Image
        style={{ width: 100, height: 150, borderRadius: 4 }}
        source={
          volume.imageLinks?.smallThumbnail ?? volume.imageLinks?.thumbnail
        }
        contentFit="cover"
      />
      <View style={[{ display: 'flex', gap: 4 }, styles.bookText]}>
        <Text style={styles.bookTitle}>{volume.title}</Text>
        {volume.authors?.length > 0 && (
          <Text>by {volume.authors.join(', ')}</Text>
        )}
      </View>
    </View>
  )
}

function useDebounce(value, delay) {
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
