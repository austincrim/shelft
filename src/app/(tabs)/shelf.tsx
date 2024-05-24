import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShelfStore } from '../../store'
import { BookCover } from '../components/BookCover'

export default function Shelf() {
  let shelves = useShelfStore((state) => state.shelves)

  return (
    <SafeAreaView style={{ display: 'flex', gap: 32 }}>
      {shelves.map((shelf) => (
        <View key={shelf.id}>
          <Text style={{ fontSize: 24 }}>{shelf.name}</Text>
          <FlatList
            data={shelf.books}
            renderItem={({ item }) => (
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <BookCover book={item} />
                <Text key={item.id}>{item.volumeInfo.title}</Text>
              </View>
            )}
            horizontal={true}
          />
        </View>
      ))}
    </SafeAreaView>
  )
}
