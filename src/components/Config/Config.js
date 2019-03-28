import { h, app } from 'hyperapp'

import InputBase from '../InputBase/InputBase'
import { toggleTheme } from '../../libs/utils'
import youtubeApi from '../../api/youtube'

import IconYoutube from '../../components/Icons/IconYoutube'

import * as constants from '../../libs/constants'

import '../../stylesheets/main.scss'
import './config.scss'
import twitchApi from '../../api/twitch'

app(
  {
    theme: 'light',
    id: null,
    saved: false,
    error: null,
  },
  {
    initTwitch: () => (state, actions) => {
      if (twitchApi.twitch) {
        twitchApi.twitch.onAuthorized(() => {
          const configBroadcaster = twitchApi.getConfigurationSegment()
          console.log(twitchApi.twitch.configuration)
          if (configBroadcaster) {
            if (configBroadcaster.id) {
              actions.setId(configBroadcaster.id)
            }
          }
        })

        twitchApi.twitch.onContext((context) => {
          if (context && context.theme) actions.setTheme(context.theme)
        })

        twitchApi.twitch.onError((error) => actions.setError(error))
      }
    },
    handleSubmitForm: (event) => (state, actions) => {
      event.preventDefault()
      twitchApi.setConfigurationSegment({
        id: state.id,
      })
      actions.setSaved()
    },
    setSaved: (saved = true) => (state, actions) => {
      if (saved !== state.saved) {
        if (saved) setTimeout(() => actions.setSaved(!saved), 2000)
        return { saved }
      }
    },
    setId: (id) => ({ id }),
    setTheme: (theme) => (state) => toggleTheme(theme, state.theme),
    setError: (error) => ({ error }),
  },
  (state, actions) => (
    <div className="app" oncreate={actions.initTwitch}>
      <div className="config">
        <IconYoutube />
        <div className="config__form">
          <form className="form" onsubmit={actions.handleSubmitForm}>
            <InputBase
              placeholder="Please type youtube channel ID"
              onChange={actions.setId}
              label="Youtube channel id"
              value={state.id}
            />
            <div className="form__footer">
              <button
                type="submit"
                className="btn btn--block btn--primary"
                disabled={state.saved || !state.id}
              >
                {state.saved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </form>
        </div>
        <div className="config__footer">
          <a
            className="config__link-twitch"
            href="https://www.twitch.tv/suhodolskiy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Powered by <span>@suhodolskiy</span>
          </a>
          <a
            className="config__link-repo"
            href="https://github.com/suhodolskiy/twitch-extension-youtube"
            rel="noopener noreferrer"
            target="_blank"
          >
            github.com/suhodolskiy/twitch-extension-youtube
          </a>
        </div>
      </div>
    </div>
  ),
  document.getElementById('root')
)
