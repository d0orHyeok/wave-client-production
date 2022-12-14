import styled from 'styled-components'
import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react'
import { IPlaylist } from '@appTypes/types.type.'
import {
  EmptyMusicCover,
  EmptyMusicCoverBackgorund,
  EmptyPlaylistImage,
  EmptyPlaylistImageBackground,
} from '@styles/EmptyImage'
import * as AnyHeadStyle from '@styles/AnyHead.style'
import { PrimaryButton } from '@components/Common/Button'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import {
  caculateDateAgo,
  convertTimeToString,
  getGradientFromImageUrl,
} from '@api/functions'
import { Link } from 'react-router-dom'
import {
  addMusic,
  clearMusics,
  togglePlay,
} from '@redux/features/player/playerSlice'
import Waveform from '@components/Waveform/Waveform'

const Wrapper = styled(AnyHeadStyle.AnyHeadWrapper)`
  position: relative;
  height: 260px;
`

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
`

const PlaylistImage = styled(AnyHeadStyle.AnyHeadImage)`
  flex-shrink: 0;
  margin-left: 2em;
  width: 200px;
  height: 200px;
`

const PlaylistInfo = styled(AnyHeadStyle.AnyHeadInfo)`
  margin-right: auto;

  & .info.info-link:hover {
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
  }
`

const PlayButton = styled(PrimaryButton)`
  flex-shrink: 0;
  margin-right: 15px;
  width: 50px;
  height: 50px;
  font-size: 20px;
  border-radius: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const SubInfo = styled.div`
  flex-shrink: 0;
  text-align: right;
  margin-left: 1em;

  & .ago {
    font-size: 0.9em;
    line-height: 0.9em;
  }
`

const PlaylistMusicCounter = styled.div`
  position: absolute;
  bottom: 30px;
  left: 30px;

  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  height: 100px;
  width: 100px;
  border-radius: 50px;
  background-color: black;
  color: white;

  & .musicCount {
    font-size: 20px;
    margin-bottom: 10px;
  }

  & .durationSum {
    color: #929292;
  }
`

const WaveFormBox = styled.div`
  position: relative;
  width: calc(100% - 200px);
  padding-right: 30px;
  top: -60px;
`

interface PlaylistHeadProps {
  playlist: IPlaylist
}

const PlaylistHead = ({ playlist }: PlaylistHeadProps) => {
  const dispatch = useAppDispatch()

  const isPlay = useAppSelector((state) => state.player.controll.isPlay)
  const { currentMusic, musics: nextups } = useAppSelector(
    (state) => state.player
  )

  const [active, setActive] = useState(false)
  const [background, setBackground] = useState<string>(
    EmptyPlaylistImageBackground
  )

  const handleClickPlay = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      if (!active) {
        dispatch(clearMusics())
        dispatch(addMusic(playlist.musics))
        dispatch(togglePlay(true))
      } else {
        dispatch(togglePlay())
      }
    },
    [active, dispatch, playlist.musics]
  )

  const changeActive = useCallback(() => {
    if (nextups.length !== playlist.musics.length) {
      setActive(false)
    } else {
      const bol =
        nextups.findIndex(
          (nextup) =>
            playlist.musics.findIndex((m) => m.id === nextup.id) === -1
        ) === -1
      setActive(bol)
    }
  }, [nextups, playlist.musics])

  const changeBackground = useCallback(async () => {
    if (active) {
      const newBackground = currentMusic?.cover
        ? await getGradientFromImageUrl(
            currentMusic.cover,
            EmptyMusicCoverBackgorund
          )
        : EmptyMusicCoverBackgorund
      setBackground(newBackground)
    } else {
      const newBackground = playlist.image
        ? await getGradientFromImageUrl(
            playlist.image,
            EmptyPlaylistImageBackground
          )
        : EmptyPlaylistImageBackground
      setBackground(newBackground)
    }
  }, [active, currentMusic?.cover, playlist.image])

  const drawImage = useCallback(() => {
    if (active) {
      return currentMusic?.cover ? (
        <img className="img" src={currentMusic.cover} alt="" />
      ) : (
        <EmptyMusicCover className="img" />
      )
    } else {
      return playlist?.image ? (
        <img className="img" src={playlist.image} alt="" />
      ) : (
        <EmptyPlaylistImage className="img" />
      )
    }
  }, [active, currentMusic?.cover, playlist.image])

  useEffect(() => {
    changeActive()
  }, [changeActive])

  useLayoutEffect(() => {
    changeBackground()
  }, [changeBackground])

  return (
    <Wrapper background={background}>
      <Container>
        <PlayButton onClick={handleClickPlay}>
          {!isPlay || !active ? (
            <FaPlay style={{ transform: 'translateX(2px)' }} />
          ) : (
            <FaPause />
          )}
        </PlayButton>
        <PlaylistInfo>
          <div className="info info-main">{playlist.name}</div>
          <div className="info info-link">
            <Link to={`/profile/${playlist.userId}`}>
              {playlist.user?.nickname || playlist.userId}
            </Link>
          </div>
        </PlaylistInfo>

        <SubInfo>
          <div className="ago">{caculateDateAgo(playlist.createdAt)}</div>
        </SubInfo>

        <PlaylistImage>{drawImage()}</PlaylistImage>
      </Container>
      {currentMusic && active ? (
        <WaveFormBox>
          <Waveform music={currentMusic} active={active} />
        </WaveFormBox>
      ) : (
        <PlaylistMusicCounter>
          <div className="musicCount">{playlist.musicsCount}</div>
          <div>TRACKS</div>
          {playlist.musics ? (
            <div className="durationSum">
              {convertTimeToString(
                playlist.musics.reduce(
                  (prev, value) => prev + value.duration,
                  0
                )
              )}
            </div>
          ) : null}
        </PlaylistMusicCounter>
      )}
    </Wrapper>
  )
}

export default PlaylistHead
