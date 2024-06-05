import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { Image } from 'expo-image'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '../../hooks'
import { VolumeResponse } from '../../types'
import { BookCover } from '../../components/BookCover'

export default function Screen() {
  let navigation = useNavigation()
  let { id } = useLocalSearchParams()
  let { data: book, status } = useQuery<VolumeResponse>({
    queryKey: [`book/${id}`],
    queryFn: async () => {
      let res = await fetch(API_URL + `/${id}`)
      return res.json()
    },
  })

  useEffect(() => {
    navigation.setOptions({
      title: book?.volumeInfo?.title ?? 'Loading...',
      presentation: 'modal',
    })
  }, [navigation, book])

  return (
    <View style={{ flex: 1 }}>
      {status === 'success' && book ? (
        <BookCover width={200} height={300} book={book} />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  )
}
