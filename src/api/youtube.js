import get from 'lodash.get'

const request = (query) =>
  fetch('https://www.googleapis.com/youtube/v3' + query, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())

export default {
  getChannelInfo(id) {
    return request(
      `/channels?part=snippet,statistics&id=${id}&key=${
        process.env.YOUTUBE_KEY
      }`
    ).then((response) => get(response, 'items.0', null))
  },
  getChannelVideos(id) {
    return request(
      `/search?channelId=${id}&part=snippet&order=date&maxResults=12&key=${
        process.env.YOUTUBE_KEY
      }`
    ).then((response) => response.items)
  },
}
