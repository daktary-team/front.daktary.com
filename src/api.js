const api = {}

/**
 * Load document from Github
 *
 * @param {String} apiUrl Github blob api url.
 * @return {Promise} json Json file with html and metas.
 */
api.fetch = apiUrl =>
  window.fetch(`https://api.daktary.com/${apiUrl}`)
    .then(response => response.json())
