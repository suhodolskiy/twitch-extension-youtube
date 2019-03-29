import { h } from 'hyperapp'
import get from 'lodash.get'
import './video-card.scss'

export default ({ video }) => {
  const title = get(video, 'snippet.title')
  return (
    <a
      rel="noopener noreferrer"
      className="video-card"
      href={`https://www.youtube.com/watch?v=` + get(video, 'id.videoId')}
      target="_blank"
    >
      <picture className="video-card__picture">
        <source
          srcSet={`${get(video, 'snippet.thumbnails.medium.url')} 2x, ${get(
            video,
            'snippet.thumbnails.default.url'
          )} 1x`}
        />
        <img src={get(video, 'snippet.thumbnails.default.url')} alt={title} />
      </picture>
      <div className="video-card__title">{title}</div>
      <span>{get(video, 'snippet.description')}</span>
    </a>
  )
}
