import { useState } from 'react'
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native'
import { Link } from 'expo-router'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSearchBooks } from '../hook'
import { type Book } from '../types'

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
  bookText: {
    flexShrink: 1,
    maxWidth: '85%',
  },
})

export default function Home() {
  let [search, setSearch] = useState('')
  let { data, status, isFetching, fetchNextPage, isFetchingNextPage } =
    useSearchBooks(search)

  return (
    <SafeAreaView style={styles.screen}>
      <TextInput
        placeholder="Search books..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />
      <View style={{ flex: 1 }}>
        {status === 'success' ? (
          <FlatList
            data={data?.pages.flatMap((page) => page.items)}
            renderItem={({ item }) => <BookRow book={item} />}
            keyExtractor={(book, i) => book?.id ?? i}
            onEndReached={() => !isFetching && fetchNextPage()}
            onScrollBeginDrag={() => Keyboard.dismiss()}
          />
        ) : status === 'pending' ? (
          <Text>Loading...</Text>
        ) : (
          <Text>No books found</Text>
        )}
        {isFetchingNextPage && (
          <ActivityIndicator style={{ flex: 1, marginTop: 24 }} size="large" />
        )}
      </View>
    </SafeAreaView>
  )
}

function BookRow({ book }: { book: Book }) {
  if (!book) return <></>
  let volume = book.volumeInfo

  // TODO refetch book details on nav, add shelf books to local store
  return (
    <Link
      onPress={() => {}}
      href={{
        pathname: '/book/[id]',
        params: { id: book.id },
      }}
    >
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
    </Link>
  )
}
