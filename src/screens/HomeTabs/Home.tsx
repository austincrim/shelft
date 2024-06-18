import { useRef, useState } from 'react'
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native'
import { SymbolView } from 'expo-symbols'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation, useScrollToTop } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FlashList } from '@shopify/flash-list'
import { useBookSearch } from '@/hooks'
import { useShelfStore } from '@/store'
import { BookCover } from '@/components/BookCover'
import { useQueryClient } from '@tanstack/react-query'
import { ContextMenuButton } from 'react-native-ios-context-menu'
import type { Book } from '@/types'

export function Home() {
  let scrollRef = useRef(null)
  let [search, setSearch] = useState('lord of the rings')
  let { top } = useSafeAreaInsets()
  let { data, status, isFetching, isFetchingNextPage, fetchNextPage } =
    useBookSearch(search)

  useScrollToTop(scrollRef)

  return (
    <View style={{ flex: 1, marginTop: top }}>
      <TextInput
        placeholder="Search books..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />
      {status === 'success' && data?.pages.length && data.pages.length > 0 ? (
        <FlashList
          data={data?.pages.flatMap((page) => page.items)}
          renderItem={({ item }) => <BookRow book={item} />}
          estimatedItemSize={182}
          keyExtractor={(book) => `${book?.etag}${book?.id}`}
          onEndReached={() => !isFetching && fetchNextPage()}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          ref={scrollRef}
        />
      ) : status === 'success' ? (
        <Text>No books found</Text>
      ) : (
        <Text style={{ display: 'flex', justifyContent: 'center' }}>
          Loading...
        </Text>
      )}
      {isFetchingNextPage && (
        <ActivityIndicator style={{ marginVertical: 4 }} size="large" />
      )}
    </View>
  )
}

function BookRow({ book }: { book: Book }) {
  if (!book) return <></>
  let navigation = useNavigation()
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
        navigation.navigate('VolumeDetails', { id: book.id })
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
            <ContextMenuButton
              menuConfig={{
                menuTitle: `${bookInShelf ? 'Move' : 'Add'} to shelf...`,
                menuItems: [
                  ...store.shelves
                    .filter((s) => s.id !== bookInShelf?.shelfId)
                    .map((s) => ({
                      actionTitle: s.name,
                      actionKey: String(s.id),
                    })),
                ],
              }}
              onPressMenuItem={({ nativeEvent }) => {
                if (nativeEvent.actionKey === 'cancel') return

                let toShelf = store.shelves.find(
                  (s) => s.id === Number(nativeEvent.actionKey)
                )
                if (!toShelf) return
                store.addToShelf(toShelf.id, book)
              }}
            >
              <SymbolView
                name={bookInShelf ? 'ellipsis' : 'plus'}
                resizeMode="scaleAspectFit"
              />
            </ContextMenuButton>
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
