import { Image, type ImageErrorEventData } from 'expo-image'
import { Book } from '../types'
import { DimensionValue, StyleSheet, View } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { useState } from 'react'

export function BookCover({
  book,
  width = 100,
  height = 150,
}: {
  book: Book
  width?: DimensionValue
  height?: DimensionValue
}) {
  let imageSrc =
    book.volumeInfo.imageLinks?.thumbnail ??
    book.volumeInfo.imageLinks?.smallThumbnail
  let [error, setError] = useState<null | ImageErrorEventData>(null)

  return error ? (
    <View style={[{ width, height }, styles.placeholder]}>
      <SymbolView name="book" resizeMode="scaleAspectFit" tintColor="grey" />
    </View>
  ) : (
    <Image
      style={{ width, height, borderRadius: 4 }}
      source={imageSrc}
      contentFit="cover"
      onError={(e) => setError(e)}
      onLoad={() => setError(null)}
    />
  )
}

let styles = StyleSheet.create({
  placeholder: {
    borderRadius: 4,
    backgroundColor: 'lightgrey',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
