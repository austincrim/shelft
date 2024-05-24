import { useRef, useState } from 'react'
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  FlatList,
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
import { type Book } from '../../types'
import { useShelfStore } from '../../store'
import { BookCover } from '../components/BookCover'

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
  let store = useShelfStore((state) => state)
  let volume = book.volumeInfo

  return (
    <View style={styles.bookRow}>
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
        <View style={{ alignSelf: 'flex-end' }}>
          <TouchableOpacity
            onPress={async () => {
              let options = [...store.shelves.map((s) => s.name), 'Cancel']
              let cancelButtonIndex = options.length - 1
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  title: `Add ${book.volumeInfo.title} to shelf:`,
                  options,
                  cancelButtonIndex,
                },
                (pressedIndex) => {
                  if (pressedIndex === cancelButtonIndex) return
                  store.addToShelf(store.shelves[pressedIndex].id, book)
                }
              )
            }}
          >
            <SymbolView name="plus" resizeMode="scaleAspectFit" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    borderBottomWidth: 2,
    fontSize: 20,
    marginTop: 32,
    padding: 8,
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
    fontWeight: 'bold',
  },
})
