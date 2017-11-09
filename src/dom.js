/* global route */

/**
 * Functions dedicate to DOM interaction
 *
 */

const dom = {}

/**
* get anchor in html
*
* @return {Object} node anchor.
*/
dom.getAnchor = hash => document.querySelector(`a[name="${hash}"]`)

/**
* Inject Github document in html
*
*/
dom.injectInHtml = blobPromise => {
  blobPromise
    .then(page => {
      switch (page.type) {
        case 'file':
          dom._injectBlobInHtml(page)
          break
        case 'tree':
          dom._injectTreeInHtml(page)
          break
        case 'repos':
          dom._injectTreeInHtml(page)
          break
        default:
          const container = document.querySelector('main.container')
          container.innerHTML = page.body
      }
    })
}

/**
 * Private functions
 */

/**
* Inject Github document in html
*
* @param {Object} page a json document from daktary API.
*/
dom._injectBlobInHtml = page => {
  const tpl = document.querySelector('template#tplBlob').content
  tpl.querySelector('.blobGhLink').href = `https://github.com/${dom._ghPath()}`
  tpl.querySelector('.blobContent').innerHTML = page.body
  dom._injectTpl(tpl)
}

/**
* Inject Github tree in html
*
* @param {Object} page a json tree from daktary API.
*/
dom._injectTreeInHtml = page => {
  const tpl = document.querySelector('template#tplTree').cloneNode(true).content
  const articleFile = tpl.querySelector('.ghTypeFile')
  const articleFolder = tpl.querySelector('.ghTypeFolder')
  const articleRepo = tpl.querySelector('.ghTypeRepo')
  const section = tpl.querySelector('section.ghTree')
  section.innerHTML = ''

  page.body.forEach(item => {
    switch (item.type) {
      case 'file':
        const file = articleFile.cloneNode(true)
        file.querySelector('h2 a.fileLink').innerText = item.meta ? item.meta.title : item.name
        file.querySelector('h2 a.fileLink').href = `#${item.full_name}`
        file.querySelector('p.ghTreeExcerpt').innerText = item.meta ? item.meta.description : ''
        file.querySelector('a.ghTreeReadmore').title += item.meta ? item.meta.title : item.name
        file.querySelector('a.ghTreeReadmore').href = `#${item.full_name}`
        section.appendChild(file)
        break
      case 'dir':
        const folder = articleFolder.cloneNode(true)
        folder.querySelector('h2 a.folderLink').innerText = item.name
        folder.querySelector('h2 a.folderLink').href = `#${item.full_name}`
        folder.querySelector('a.folderGhLink').href = item.html_url
        section.appendChild(folder)
        break
      default: // case 'repo':
        const repo = articleRepo.cloneNode(true)
        repo.querySelector('h2 a.repoLink').innerText = item.name
        repo.querySelector('h2 a.repoLink').href = `#${item.full_name}`
        repo.querySelector('a.repoGhLink').href = item.html_url
        section.appendChild(repo)
    }
    dom._injectTpl(section)
  })
}

/**
* Replace the html main.container's childrens by a template content
*
* @param {Object} templateContent a template content.
*/
dom._injectTpl = tpl => {
  const container = document.querySelector('main.container')
  container.innerHTML = ''
  container.appendChild(document.importNode(tpl, true))
}

/**
* get ghPath with route.js
*
* @return {Object} node anchor.
*/
dom._ghPath = () =>
  route.getHash()
