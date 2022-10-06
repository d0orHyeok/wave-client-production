import { IMusic, IUser } from '@appTypes/types.type.'
import * as S from './HomePage.style'
import React, { useCallback, useState, useEffect } from 'react'
import { getAllMusic } from '@api/musicApi'
import { Helmet } from 'react-helmet-async'
import { ISetsCardProps } from '@components/SetsCard/SetsCard'
import SmallCardSlider from '@components/SmallCardSlider/SmallCardSlider'
import Axios from '@api/Axios'
import Loading from '@components/Loading/Loading'
import { useAppSelector } from '@redux/hook'
import { Link } from 'react-router-dom'
import { IoRefreshOutline } from 'react-icons/io5'
import { IconButton } from '@mui/material'
import Reload from '@components/Loading/Reload'

interface ChartItem {
  genre: string
  musics: IMusic[]
}

const HomePage = () => {
  const uid = useAppSelector((state) => state.user.userData?.id)
  const historys = useAppSelector(
    (state) => state.user.userData?.historys || []
  )

  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(false)
  const [newReleaseItems, setNewReleaseItems] = useState<ISetsCardProps[]>()
  const [trendItems, setTrendItems] = useState<ISetsCardProps[]>()
  const [relatedMusics, setRelatedMusics] = useState<IMusic[]>()
  const [randomMusics, setRandomMusics] = useState<IMusic[]>()
  const [randomUsers, setRandomUsers] = useState<IUser[]>()

  const getChartItems = useCallback(async (option: 'trend' | 'newrelease') => {
    try {
      const response = await getAllMusic({ params: { option } })
      const items: ChartItem[] = response.data
      return items.map((item) => {
        const path =
          item.genre.indexOf('All music genres') !== -1 ? 'all' : item.genre
        const subText = option === 'trend' ? 'Top 100' : 'New Release'
        return {
          mainText: {
            name: item.genre,
            link: `/${option}/${path}`,
          },
          subText,
          musics: item.musics,
        }
      })
    } catch (error) {
      console.error(error)
      return []
    }
  }, [])

  const getAllItems = useCallback(async () => {
    const nrItems = await getChartItems('newrelease')
    const tItems = await getChartItems('trend')
    setNewReleaseItems(nrItems)
    setTrendItems(tItems)
  }, [getChartItems])

  const getRelated = useCallback(async () => {
    if (!uid) {
      return setRelatedMusics([])
    }
    try {
      const response = await Axios.get('/api/music/related')
      setRelatedMusics(response.data)
    } catch (error) {
      console.error(error)
      setRelatedMusics([])
    }
  }, [uid])

  const getRandomMusics = useCallback(async () => {
    try {
      const response = await Axios.get('/api/music/random')
      setRandomMusics(response.data)
    } catch (error) {
      console.error(error)
      setRandomMusics([])
    }
  }, [])

  const getRandomUsers = useCallback(async () => {
    try {
      const response = await Axios.get('/api/auth/random')
      setRandomUsers(response.data)
    } catch (error) {
      console.error(error)
      setRandomUsers([])
    }
  }, [])

  const reloadRandomUsers = useCallback(async () => {
    setReload(true)
    await getRandomUsers()
    setReload(false)
  }, [getRandomUsers])

  const checkLoading = useCallback(() => {
    if (
      Boolean(newReleaseItems) &&
      Boolean(trendItems) &&
      Boolean(randomMusics) &&
      Boolean(randomUsers)
    ) {
      setLoading(false)
    }
  }, [newReleaseItems, randomMusics, randomUsers, trendItems])

  useEffect(() => {
    getAllItems()
  }, [getAllItems])

  useEffect(() => {
    getRelated()
  }, [getRelated])

  useEffect(() => {
    getRandomMusics()
  }, [getRandomMusics])

  useEffect(() => {
    getRandomUsers()
  }, [getRandomUsers])

  useEffect(() => {
    checkLoading()
  }, [checkLoading])

  return (
    <>
      <Helmet>
        <title>Wave | Stream and share to music online</title>
      </Helmet>
      {loading ? (
        <Loading />
      ) : (
        <>
          <S.Wrapper>
            {/* 인기 차트 */}
            {trendItems?.length ? (
              <S.Container>
                <h2 className="section-title">
                  <Link to="/trend">Charts: Top 50</Link>
                </h2>
                <div className="section-description">
                  The most played tracks on Wave this week
                </div>
                <SmallCardSlider cardsProps={trendItems} />
              </S.Container>
            ) : (
              <></>
            )}
            {/* 최신 차트 */}
            {newReleaseItems?.length ? (
              <S.Container>
                <h2 className="section-title">
                  <Link to="/newrelease">Charts: New Release</Link>
                </h2>
                <div className="section-description">
                  Up-and-coming tracks on Wave this week
                </div>
                <SmallCardSlider cardsProps={newReleaseItems} />
              </S.Container>
            ) : (
              <></>
            )}
            {/* 랜덤 추천 */}
            {randomUsers?.length ? (
              <S.Container>
                <h2 className="section-title section-title-flex">
                  <span className="title">Artists You Should Know</span>
                  <IconButton
                    className="refreshBtn"
                    onClick={reloadRandomUsers}
                  >
                    <IoRefreshOutline />
                    Refresh List
                  </IconButton>
                </h2>

                <div className="section-description">
                  Top tracks from random artist
                </div>
                {!reload ? (
                  <SmallCardSlider
                    cardsProps={randomUsers.map((user) => {
                      return { user, subText: 'Artist tracks' }
                    })}
                  />
                ) : (
                  <S.ReloadBox>
                    <Reload size={100} />
                  </S.ReloadBox>
                )}
              </S.Container>
            ) : (
              <></>
            )}
            {randomMusics?.length ? (
              <S.Container>
                <h2 className="section-title">Recommended tracks for you</h2>
                <div className="section-description">
                  {`These are tracks that we recommend randomly`}
                </div>
                <SmallCardSlider
                  cardsProps={randomMusics.map((music) => {
                    return { music }
                  })}
                />
              </S.Container>
            ) : (
              <></>
            )}
            {/* 재생기록 */}
            {historys && historys?.length ? (
              <S.Container>
                <h2 className="section-title">Listening history</h2>
                <div className="section-description">
                  {`Recent played tracks you've been listen`}
                </div>
                <SmallCardSlider
                  cardsProps={historys.map((history) => {
                    return { music: history.music }
                  })}
                />
              </S.Container>
            ) : (
              <></>
            )}
            {/* 연관 음악 */}
            {relatedMusics?.length ? (
              <S.Container>
                <h2 className="section-title">More of what you like</h2>
                <div className="section-description">
                  {`Suggestions based on what you've recently liked or played`}
                </div>
                <SmallCardSlider
                  cardsProps={relatedMusics.map((music) => {
                    return { music }
                  })}
                />
              </S.Container>
            ) : (
              <></>
            )}
          </S.Wrapper>
        </>
      )}
    </>
  )
}

export default React.memo(HomePage)
