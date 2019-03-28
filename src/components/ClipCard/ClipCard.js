import get from 'lodash.get'
import { h } from 'hyperapp'
import './clip-card.scss'

export default ({ clip }) => {
  const title = get(clip, 'snippet.title')
  return (
    <a
      rel="noopener noreferrer"
      className="clip-card"
      href={`https://www.youtube.com/watch?v=` + get(clip, 'id.videoId')}
      target="_blank"
    >
      <picture className="clip-card__picture">
        <source
          srcSet={`${get(clip, 'snippet.thumbnails.medium.url')} 2x, ${get(
            clip,
            'snippet.thumbnails.default.url'
          )} 1x`}
        />
        <img src={get(clip, 'snippet.thumbnails.default.url')} alt={title} />
      </picture>
      <div className="clip-card__title">{title}</div>
      <span>{get(clip, 'snippet.description')}</span>
    </a>
  )
}
