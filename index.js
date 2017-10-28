document.addEventListener('DOMContentLoaded', () => {
  const ghUrlFromHtml = document.querySelector('[data-gh]').getAttribute('data-gh')
  const htmlContainer = document.querySelector('[data-gh]')
  injectBlobInHtml(ghUrlFromHtml, htmlContainer)
})

/**
 * Inject Github document in html 
 *
 * @param {String} apiUrl Github blob api url.
 * @param {Object} targetNode Target html node.
 * @return {Promise} json Json file with html and metas.
 */
const injectBlobInHtml = (apiUrl, targetNode) => {
  getBlobFromGh(apiUrl)
    .then(json => { targetNode.innerHTML = json.body })
}

/**
 * Load document from Github
 *
 * @param {String} apiUrl Github blob api url.
 * @return {Promise} json Json file with html and metas.
 */
const getBlobFromGh = apiUrl =>
  new Promise(resolve =>
    window.fetch(`http://api.daktary.com/${apiUrl}`)
      .then(response => response.json())
      .then(json => resolve(json))
  )
