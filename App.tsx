import { useEffect, useState } from 'react'
import {
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { SymbolView } from 'expo-symbols'
import {
  QueryClientProvider,
  QueryClient,
  useQuery,
} from '@tanstack/react-query'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'

const API_URL = `https://openlibrary.org/search.json`
let queryClient = new QueryClient()

export default function Root() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

function App() {
  let [search, setSearch] = useState('')
  let debounced = useDebounce(search, 500)
  let booksQuery = useQuery({
    queryKey: [debounced],
    queryFn: ({ queryKey }) => {
      if (!queryKey) return []
      return fetch(API_URL + `?q=${queryKey}&offset=0&limit=10`).then((res) =>
        res.json()
      )
    },
  })

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Shelft</Text>
      </View>
      <TextInput
        placeholder="Search books..."
        className="border w-1/2 p-2 mx-auto rounded-md mt-8"
        value={search}
        onChangeText={setSearch}
      />
      <View className="flex h-full">
        {booksQuery.isSuccess ? (
          <FlashList
            data={booksQuery.data}
            renderItem={({ item }) => <BookRow book={item} />}
          />
        ) : booksQuery.isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <Text>No books found</Text>
        )}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

function BookRow({ book }) {
  let key = book.cover_edition_key ?? book.cover_key ?? null
  return (
    <View className="flex flex-col items-center mt-8 gap-2">
      {key && (
        <Image
          style={{ width: 100, height: 150 }}
          source={`https://covers.openlibrary.org/b/olid/${key}-M.jpg`}
          contentFit="cover"
        />
      )}
      <Text className="font-semibold text-xl">{book.title}</Text>
    </View>
  )
}

let styles = StyleSheet.create({
  screen: {
    display: 'flex',
    flex: 1,
    padding: 16,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 32 },
})

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
