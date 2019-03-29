import get from 'lodash.get'
import { h, app } from 'hyperapp'
import { toggleTheme } from '../../libs/utils'

import youtubeApi from '../../api/youtube'
import twitchApi from '../../api/twitch'

import IconYoutube from '../../components/Icons/IconYoutube'
import VideoCard from '../../components/VideoCard/VideoCard'

import '../../stylesheets/main.scss'
import './panel.scss'

app(
  {
    theme: 'dark',
    loading: false,
    channel: null,
    videos: null,
    error: null,
  },
  {
    initTwitch: () => async (state, actions) => {
      if (twitchApi.twitch) {
        twitchApi.twitch.onAuthorized(() => {
          const configBroadcaster = twitchApi.getConfigurationSegment()
          if (configBroadcaster) {
            if (configBroadcaster.id) {
              actions.loadYoutubeChannel(configBroadcaster.id)
            }
          }
        })

        twitchApi.twitch.onContext((context) => {
          if (context && context.theme) actions.setTheme(context.theme)
        })

        twitchApi.twitch.onError((error) => actions.setError(error))
      }
    },
    loadYoutubeChannel: (id) => async (state, actions) => {
      try {
        actions.setLoading()

        const channel = await youtubeApi.getChannelInfo(id)
        if (channel) {
          actions.setChannel(channel)
          actions.setVideos(await youtubeApi.getChannelVideos(id))
        }
      } catch (error) {
        actions.setError(error)
      } finally {
        actions.setLoading(false)
      }
    },
    setChannel: (channel) => ({ channel }),
    setVideos: (videos) => ({ videos }),
    setLoading: (state = true) => ({ loading: state }),
    setTheme: (theme) => (state) => toggleTheme(theme, state.theme),
    setError: (error) => ({ error }),
  },
  (state, actions) => {
    const url = state.channel
      ? `https://www.youtube.com/channel/` + state.channel.id
      : null

    return (
      <div className="app" oncreate={actions.initTwitch}>
        <header className="header">
          <a
            href={url}
            className="header__link-container"
            rel="noopener noreferrer"
            target="_blank"
          >
            <picture className="header__avatar">
              <source
                srcSet={`${get(
                  state.channel,
                  'snippet.thumbnails.medium.url'
                )} 2x, ${get(
                  state.channel,
                  'snippet.thumbnails.default.url'
                )} 1x`}
              />
              <img
                src={get(state.channel, 'snippet.thumbnails.default.url')}
                alt="User avatar"
              />
            </picture>

            {state.channel && (
              <div className="header__info">
                <span>{get(state.channel, 'snippet.title')}</span>
                {!get(
                  state.channel,
                  'statistics.hiddenSubscriberCount',
                  false
                ) && (
                  <div className="header__subscribers">
                    {get(state.channel, 'statistics.subscriberCount', 0)}{' '}
                    subscribers
                  </div>
                )}
              </div>
            )}

            <IconYoutube />
          </a>
        </header>
        <div className="app__content">
          {state.error}
          {state.loading && 'Loading ...'}
          {state.videos && (
            <div className="clips">
              {state.videos.map((video) => (
                <VideoCard video={video} key={get(video, 'id.videoId')} />
              ))}
            </div>
          )}
        </div>
        {/*<footer className="footer">*/}
        {/*<a*/}
        {/*href={url ? url + '?sub_confirmation=1' : null}*/}
        {/*className="btn btn--block btn--primary"*/}
        {/*rel="noopener noreferrer"*/}
        {/*target="_blank"*/}
        {/*>*/}
        {/*Subscribe*/}
        {/*</a>*/}
        {/*</footer>*/}
      </div>
    )
  },
  document.getElementById('root')
)
