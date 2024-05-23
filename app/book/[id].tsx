import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { API_URL } from '../hook'
import { Image } from 'expo-image'

export default function Screen() {
  let navigation = useNavigation()
  let { id } = useLocalSearchParams()
  let { data, status } = useQuery({
    queryKey: [`book/${id}`],
    queryFn: async () => {
      let res = await fetch(API_URL + `/${id}`)
      return res.json()
    },
  })

  useEffect(() => {
    navigation.setOptions({ title: data?.volumeInfo?.title ?? 'Loading...' })
  }, [navigation, data])

  return (
    <View style={{ flex: 1 }}>
      {status === 'success' ? (
        <Image
          style={{ width: 200, height: 400 }}
          source={
            data.volumeInfo.imageLinks.thumbnail ??
            data.volumeInfo.imageLinks.smallThumbnail
          }
          contentFit="cover"
        />
      ) : (
        <Text>Loading...</Text>
      )}
      {/* <Text>{data && JSON.stringify(data, null, 2)}</Text> */}
    </View>
  )
}
