/**
 * Functions dedicate to DOM interaction
 *
 */

const dom = {}

/**
 * Public functions
 */

/**
* get hash from url
*
* @return {String} hash hash without #.
*/
dom.getHash = () => document.location.hash.match(/#(.*)/)[1]

/**
* get anchor in html
*
* @return {Object} node anchor.
*/
dom.getAnchorOfHash = () => document.querySelector(`a[name="${dom.getHash()}"]`)

/**
* set github link in html
*
*/
dom.setHrefForBlobGhLink = () =>
  dom._getHtmlBlobGhLink().setAttribute('href', `https://github.com/${dom.getHash()}`)

/**
* Inject Github document in html
*
*/
dom.injectBlobInHtml = (blobPromise) =>
  blobPromise
    .then(json => { dom._getHtmlBlobContent().innerHTML = json.body })

/**
 * Private functions
 */

/**
* Get the node of blob tag target
*
* @return {Object} node tag of blob.
*/
dom._getHtmlBlob = () => document.querySelector('#ghBlob')

/**
* Get the node of blob content tag target
*
* @return {Object} node content tag of blob.
*/
dom._getHtmlBlobContent = () => dom._getHtmlBlob().querySelector('#ghBlobContent')

/**
* Get the node of blob github's link tag target
*
* @return {Object} node Github link of blob.
*/
dom._getHtmlBlobGhLink = () => dom._getHtmlBlob().querySelector('a#ghBlobUrl')
