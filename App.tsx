import { useEffect, useState } from 'react'
import { Pressable, Text, TextInput, View, ScrollView } from 'react-native'
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
import './global.css'

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
    <SafeAreaView className="flex flex-col gap-12 h-full">
      <View className="p-4 pb-3 bg-slate-100 flex flex-row items-center justify-between">
        <Text className="text-4xl">Shelft</Text>
        <View className="flex flex-row gap-4">
          <Pressable>
            <SymbolView
              name="book"
              resizeMode="scaleAspectFit"
              style={{ width: 32, height: 32 }}
            />
          </Pressable>
          <Pressable>
            <SymbolView
              name="person"
              resizeMode="scaleAspectFit"
              style={{ width: 32, height: 32 }}
            />
          </Pressable>
        </View>
      </View>
      <TextInput
        placeholder="Search books..."
        className="border w-1/2 p-2 mx-auto rounded-md mt-8"
        value={search}
        onChangeText={setSearch}
      />
      <View className="h-full">
        {booksQuery.isLoading ? (
          <Text>Loading...</Text>
        ) : booksQuery.isSuccess ? (
          <FlashList
            data={booksQuery.data.docs}
            renderItem={({ item }) => <BookRow book={item} />}
            estimatedItemSize={20}
          />
        ) : (
          <Text>Woops..</Text>
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
