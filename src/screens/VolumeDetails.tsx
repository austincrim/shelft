import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { BOOKS_API_URL } from '@/hooks'
import { VolumeResponse } from '@/types'
import { BookCover } from '@/components/BookCover'
import { RootStackScreenProps } from './types'

type Props = RootStackScreenProps<'VolumeDetails'>
export function VolumeDetails({ navigation, route }: Props) {
  let { data: book, status } = useQuery<VolumeResponse>({
    queryKey: [`book/${route.params.id}`],
    queryFn: async () => {
      let res = await fetch(BOOKS_API_URL + `/${route.params.id}`)
      return res.json()
    },
  })

  useEffect(() => {
    navigation.setOptions({
      title: book?.volumeInfo?.title ?? 'Loading...',
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
