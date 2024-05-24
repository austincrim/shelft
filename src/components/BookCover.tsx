import { Image } from 'expo-image'
import { Book } from '../types'
import { StyleSheet, View } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { useState } from 'react'

export function BookCover({
  book,
  width = 100,
  height = 150,
}: {
  book: Book
  width?: number
  height?: number
}) {
  let imageSrc =
    book.volumeInfo.imageLinks?.thumbnail ??
    book.volumeInfo.imageLinks?.smallThumbnail
  let [error, setError] = useState(false)

  return error ? (
    <View style={[{ width, height }, styles.placeholder]}>
      <SymbolView name="book" resizeMode="scaleAspectFit" tintColor="grey" />
    </View>
  ) : (
    <Image
      style={{ width, height, borderRadius: 4 }}
      source={imageSrc}
      contentFit="cover"
      onError={() => setError(true)}
      onLoad={() => setError(false)}
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
