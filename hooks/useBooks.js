import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect, useRef, useCallback } from 'react'

function useBooks (options = {}) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [nextPage, setNextPage] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const initialUrlRef = useRef('')

  const buildUrl = (pageUrl = null) => {
    if (pageUrl) return pageUrl
    let url = 'https://gutendex.com/books/'
    const params = []
    if (options.search) params.push(`search=${encodeURIComponent(options.search)}`)
    if (options.author_year_start != null) params.push(`author_year_start=${options.author_year_start}`)
    if (options.author_year_end != null) params.push(`author_year_end=${options.author_year_end}`)
    if (options.copyright != null) params.push(`copyright=${options.copyright}`)
    if (options.ids) params.push(`ids=${encodeURIComponent(options.ids)}`)
    if (options.languages) params.push(`languages=${encodeURIComponent(options.languages)}`)
    if (options.mime_type) params.push(`mime_type=${encodeURIComponent(options.mime_type)}`)
    if (options.sort) params.push(`sort=${encodeURIComponent(options.sort)}`)
    if (options.topic) params.push(`topic=${encodeURIComponent(options.topic)}`)
    if (params.length > 0) {
      url += '?' + params.join('&')
    }
    return url
  }

  const fetchBooks = async () => {
    setLoading(true)
    setError(null)
    const url = buildUrl()
    initialUrlRef.current = url
    const cacheKey = `books_cache_${JSON.stringify(options)}`
    try {
      const cached = await AsyncStorage.getItem(cacheKey)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (timestamp && Date.now() - timestamp < 86400000) {
          setBooks(data)
          setLoading(false)
          return
        }
      }
      const res = await fetch(url)
      if (!res.ok) throw new Error('Network response was not ok')
      const apiData = await res.json()
      setBooks(apiData.results || [])
      setNextPage(apiData.next)
      setLoading(false)
      AsyncStorage.setItem(cacheKey, JSON.stringify({ data: apiData.results || [], timestamp: Date.now() }))
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  const loadMore = useCallback(async () => {
    if (!nextPage || loadingMore || loading || refreshing) return
    setLoadingMore(true)
    try {
      const res = await fetch(nextPage)
      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()
      setBooks(prev => [...prev, ...(data.results || [])])
      setNextPage(data.next)
      setLoadingMore(false)
    } catch (err) {
      setError(err)
      setLoadingMore(false)
    }
  }, [nextPage, loadingMore, loading, refreshing])

  const refresh = useCallback(async () => {
    setRefreshing(true)
    await fetchBooks()
    setRefreshing(false)
  }, [fetchBooks])

  useEffect(() => {
    fetchBooks()
  }, [JSON.stringify(options)])

  return { books, loading, loadingMore, error, loadMore, nextPage, refreshing, refresh }
}

export default useBooks
