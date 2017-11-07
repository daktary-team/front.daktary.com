/* global api */

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
