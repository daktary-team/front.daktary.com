/* global api, dom */

/**
 * Functions dedicate to routing
 *
 */

const route = {}

/**
* get hash from url
*
* @return {String} hash hash without #.
*/
route.getHash = () => {
  try {
    return document.location.hash.match(/#(.*)/)[1]
  } catch (e) {
    return null
  }
}

/**
 * Deliver type page and load content
 *
 * @param {String} hash hash part of url.
 * @return {Promise} json Json file with html and metas.
 */
route.getPage = () =>
new Promise(resolve => {
  const hash = route.getHash()
  if (!hash) {
    resolve({type: 'home', body: '<h1>home</h1>'})
  } else {
    api.fetch(hash).then(page => {
      resolve(page)
    })
  }
})

/**
* Inject Github document in html
*
*/
route.render = () =>
  route.getPage()
    .then(page => {
      switch (page.type) {
        case 'file':
          dom.injectBlobInHtml(page)
          break
        case 'tree':
          dom.injectTreeInHtml(page)
          break
        case 'repos':
          dom.injectTreeInHtml(page)
          break
        default:
          const container = document.querySelector('main.container')
          container.innerHTML = page.body
      }
    })
