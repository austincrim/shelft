import {
  ActionSheetIOS,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShelfStore } from '@/store'
import { BookCover } from '@/components/BookCover'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import type { Book, Shelf } from '@/types'

export function Shelf() {
  let shelves = useShelfStore((state) => state.shelves)
  let { top } = useSafeAreaInsets()

  return (
    <View style={{ marginTop: top + 12, flex: 1 }}>
      <FlatList
        data={shelves}
        style={{ paddingHorizontal: 12 }}
        ItemSeparatorComponent={() => <View style={{ paddingTop: 24 }}></View>}
        renderItem={({ item: shelf }) => {
          return (
            <View key={shelf.id}>
              <Text
                style={{
                  fontSize: 28,
                  marginBottom: 24,
                  fontFamily: 'New York',
                }}
              >
                {shelf.name}
              </Text>
              {shelf.books.length === 0 ? (
                <Text style={{ color: 'grey' }}>No books yet</Text>
              ) : (
                <FlatList
                  style={{ paddingBottom: 12 }}
                  data={shelf.books}
                  horizontal={true}
                  keyExtractor={(book) => `${book?.etag}${book?.id}`}
                  renderItem={({ item }) => (
                    <BookCard shelf={shelf} book={item} />
                  )}
                />
              )}
            </View>
          )
        }}
      />
    </View>
  )
}

function BookCard({ book, shelf }: { book: Book; shelf: Shelf }) {
  let store = useShelfStore()
  let client = useQueryClient()
  let navigation = useNavigation()
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        client.setQueryData([`book/${book.id}`], book)
        navigation.navigate('VolumeDetails', { id: book.id })
      }}
      onLongPress={() => {
        let options = [
          ...store.shelves
            .filter(
              (s) => s.id !== shelf.id && !s.books.find((b) => b.id === book.id)
            )
            .map((s) => s.name),
          'Delete',
          'Cancel',
        ]
        let cancelButtonIndex = options.length - 1
        let destructiveButtonIndex = options.length - 2
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            destructiveButtonIndex,
            cancelButtonIndex,
          },
          (index) => {
            if (index === destructiveButtonIndex) {
              store.removeFromShelf(shelf.id, book)
            } else if (index === cancelButtonIndex) {
              return
            } else {
              let toShelf = store.shelves.find((s) => s.name === options[index])
              if (!toShelf) {
                console.error(`could not find shelfId ${index}`)
                return
              }
              store.moveBook({
                fromShelfId: shelf.id,
                toShelfId: toShelf.id,
                book,
              })
            }
          }
        )
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginRight: 12,
        maxWidth: 150,
      }}
    >
      <View
        style={{
          shadowColor: '#333',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.4,
          shadowRadius: 3,
          backgroundColor: 'lightgrey',
        }}
      >
        <BookCover book={book} />
      </View>
      <Text style={{ textAlign: 'center' }} key={book.id}>
        {book.volumeInfo.title}
      </Text>
    </TouchableOpacity>
  )
}
