import { useState } from 'react'
import { DimensionValue, StyleSheet, View } from 'react-native'
import { Image, type ImageErrorEventData } from 'expo-image'
import { Book, VolumeResponse } from '@/types'
import { SymbolView } from 'expo-symbols'

export function BookCover({
  book,
  width = 100,
  height = 150,
}: {
  book: Book | VolumeResponse
  width?: DimensionValue
  height?: DimensionValue
}) {
  let imageSrc = (
    book.volumeInfo.imageLinks?.thumbnail ??
    book.volumeInfo.imageLinks?.smallThumbnail ??
    book.volumeInfo.imageLinks?.small ??
    book.volumeInfo.imageLinks?.medium ??
    book.volumeInfo.imageLinks?.large
  )?.replace('http://', 'https://')
  let [error, setError] = useState<null | ImageErrorEventData>(null)

  return !imageSrc || error ? (
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
