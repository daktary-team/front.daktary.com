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
route.getHash = () => document.location.hash.substring(1)

/**
 * Deliver type page and load content
 *
 * @param {String} hash hash part of url.
 * @return {Promise} json Json file with html and metas.
 */
route.getPage = hash => {
  if (hash) {
    return api.fetch(hash)
  } else {
    return new Promise(resolve => resolve({ type: 'home', body: '<h1>home</h1>' }))
  }
}

/**
* Inject Github document in html
*
*/
route.render = () =>
  route.getPage(route.getHash())
    .then(page => {
      dom.render(page)
    })
