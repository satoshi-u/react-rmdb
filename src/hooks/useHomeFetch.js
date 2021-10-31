import { useState, useEffect } from 'react'
// API
import API from '../API'
// Helpers
import { isPersistedState } from '../helpers'

const initialState = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
}

export const useHomeFetch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // console.log('searchTerm: ', searchTerm)

  const fetchMovies = async (page, searchTerm = '') => {
    setError(false)
    setLoading(true)
    try {
      const movies = await API.fetchMovies(searchTerm, page)
      // console.log('movies: ', movies)
      setState((prev) => ({
        ...movies,
        results:
          page > 1 ? [...prev.results, ...movies.results] : [...movies.results],
      }))
    } catch (error) {
      setError(true)
    }
    setLoading(false)
  }

  // Initial and search
  useEffect(() => {
    // get from session storage, if there
    if (!searchTerm) {
      const sessionState = isPersistedState('homeState')
      if (sessionState) {
        // console.log('Getting homeState from sessionStorage...')
        setState(sessionState)
        return
      }
    }
    // console.log('Grabbing homeState from API @Initial and search ...')
    setState(initialState)
    fetchMovies(1, searchTerm)
  }, [searchTerm])

  // Load More
  useEffect(() => {
    if (!isLoadingMore) return
    // console.log('Grabbing homeState from API @LoadMore...')
    fetchMovies(state.page + 1, searchTerm)
    setIsLoadingMore(false)
  }, [isLoadingMore, state.page, searchTerm])

  // Write to Session Storage
  useEffect(() => {
    if (!searchTerm) {
      // console.log('Setting sessionStorage...')
      sessionStorage.setItem('homeState', JSON.stringify(state))
    }
  }, [searchTerm, state])

  return { state, loading, error, searchTerm, setSearchTerm, setIsLoadingMore }
}
