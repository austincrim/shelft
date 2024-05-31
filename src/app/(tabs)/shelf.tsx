import {
  ActionSheetIOS,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShelfStore } from '../../store'
import { BookCover } from '../../components/BookCover'
import type { Book, Shelf } from '../../types'

export default function Shelf() {
  let shelves = useShelfStore((state) => state.shelves)
  let { top } = useSafeAreaInsets()

  return (
    <View style={{ marginTop: top + 12 }}>
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
                <Text style={{ color: 'grey' }}>No books yet...</Text>
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
  let remove = useShelfStore((state) => state.removeFromShelf)

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onLongPress={() => {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Delete', 'Cancel'],
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1,
          },
          (index) => {
            if (index === 0) {
              remove(shelf.id, book)
            }
          }
        )
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginRight: 12,
      }}
    >
      <View
        style={{
          shadowColor: '#222',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
        }}
      >
        <BookCover book={book} />
      </View>
      <Text key={book.id}>{book.volumeInfo.title}</Text>
    </TouchableOpacity>
  )
}
