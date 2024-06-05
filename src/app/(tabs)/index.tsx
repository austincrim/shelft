import { useRef, useState } from 'react'
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  ActionSheetIOS,
} from 'react-native'
import { SymbolView } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useScrollToTop } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FlashList } from '@shopify/flash-list'
import { useBookSearch } from '../../hooks'
import { useShelfStore } from '../../store'
import { BookCover } from '../../components/BookCover'
import type { Book } from '../../types'
import { router } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'

export default function Home() {
  let scrollRef = useRef(null)
  let [search, setSearch] = useState('lord of the rings')
  let { data, status, isFetching, isFetchingNextPage, fetchNextPage } =
    useBookSearch(search)

  useScrollToTop(scrollRef)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TextInput
        placeholder="Search books..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />
      {status === 'success' ? (
        <FlashList
          data={data?.pages.flatMap((page) => page.items)}
          renderItem={({ item }) => <BookRow book={item} />}
          estimatedItemSize={182}
          keyExtractor={(book) => `${book?.etag}${book?.id}`}
          onEndReached={() => !isFetching && fetchNextPage()}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          ref={scrollRef}
        />
      ) : status === 'pending' ? (
        <Text>Loading...</Text>
      ) : (
        <Text>No books found</Text>
      )}
      {isFetchingNextPage && (
        <ActivityIndicator style={{ marginTop: 24 }} size="large" />
      )}
    </SafeAreaView>
  )
}

function BookRow({ book }: { book: Book }) {
  if (!book) return <></>
  let store = useShelfStore()
  let client = useQueryClient()
  let volume = book.volumeInfo
  let bookInShelf = store.shelves
    .flatMap((s) => s.books)
    .find((b) => b.id === book.id)

  return (
    <TouchableOpacity
      onPress={() => {
        client.setQueryData([`book/${book.id}`], book)
        router.push(`/book/${book.id}`)
      }}
      style={styles.bookRow}
    >
      <BookCover book={book} />
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexShrink: 1,
          width: '100%',
        }}
      >
        <View style={{ display: 'flex', gap: 4 }}>
          <Text style={[styles.bookTitle]}>{volume.title}</Text>
          {volume.authors?.length > 0 && (
            <Text>by {volume.authors.join(', ')}</Text>
          )}
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16 }}>{book.volumeInfo.averageRating}</Text>
          <View>
            <TouchableOpacity
              onPress={async () => {
                let options = [
                  ...store.shelves
                    .filter((s) => s.id !== bookInShelf?.shelfId)
                    .map((s) => s.name),
                  'Cancel',
                ]
                let cancelButtonIndex = options.length - 1
                ActionSheetIOS.showActionSheetWithOptions(
                  {
                    title: `Add ${book.volumeInfo.title} to shelf:`,
                    options,
                    cancelButtonIndex,
                  },
                  (index) => {
                    if (index === cancelButtonIndex) return
                    let toShelf = store.shelves.find(
                      (s) => s.name === options[index]
                    )
                    if (!toShelf) return
                    store.addToShelf(toShelf.id, book)
                  }
                )
              }}
            >
              <SymbolView
                name={bookInShelf ? 'ellipsis' : 'plus'}
                resizeMode="scaleAspectFit"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

let styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: { fontSize: 32 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 20,
    marginVertical: 16,
    marginHorizontal: 'auto',
    padding: 8,
    width: '75%',
  },
  bookRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  bookTitle: {
    fontSize: 16,
    fontFamily: 'NewYorkBold',
  },
})
