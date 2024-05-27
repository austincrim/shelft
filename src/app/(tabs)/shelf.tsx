import { FlatList, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShelfStore } from '../../store'
import { BookCover } from '../../components/BookCover'

export default function Shelf() {
  let shelves = useShelfStore((state) => state.shelves)

  return (
    <SafeAreaView
      style={{
        display: 'flex',
        padding: 24,
      }}
    >
      <FlatList
        data={shelves}
        ItemSeparatorComponent={() => <View style={{ paddingTop: 24 }}></View>}
        renderItem={({ item: shelf }) => {
          if (shelf.books.length === 0) return null
          return (
            <View key={shelf.id}>
              <Text
                style={{
                  fontSize: 28,
                  marginBottom: 16,
                  fontFamily: 'New York',
                }}
              >
                {shelf.name}
              </Text>
              <FlatList
                style={{ paddingBottom: 12 }}
                data={shelf.books}
                renderItem={({ item }) => (
                  <View
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
                      <BookCover book={item} />
                    </View>
                    <Text key={item.id}>{item.volumeInfo.title}</Text>
                  </View>
                )}
                horizontal={true}
              />
            </View>
          )
        }}
      />
    </SafeAreaView>
  )
}
