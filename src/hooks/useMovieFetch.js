import { useState, useEffect } from 'react'
// API
import API from '../API'
// Helpers
import { isPersistedState } from '../helpers'

export const useMovieFetch = (movieId) => {
  const [state, setState] = useState('')
  const [loading, setLoading] = useState('true')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        setError(false)
        const movie = await API.fetchMovie(movieId)
        // console.log('movie: ', movie)
        const credits = await API.fetchCredits(movieId)
        // console.log('credits: ', credits)
        // Get directors only
        const directors = credits.crew.filter(
          (member) => member.job === 'Director',
        )
        setState({
          ...movie,
          actors: credits.cast,
          directors,
        })
      } catch (error) {
        setError(error)
      }
      setLoading(false)
    }

    // get from session storage, if there
    const sessionState = isPersistedState(movieId)
    if (sessionState) {
      // console.log('Getting movieId state from sessionStorage...')
      setState(sessionState)
      setLoading(false)
      return
    }
    // fetch from API instead
    // console.log('Getting movieId state from API...')
    fetchMovie()
  }, [movieId])

  // Write to Session Storage
  useEffect(() => {
    // console.log('Setting sessionStorage...')
    sessionStorage.setItem(movieId, JSON.stringify(state))
  }, [movieId, state])

  return { state, loading, error }
}
