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
  const articleFile = tpl.querySelector('.gh-type-file')
  const articleFolder = tpl.querySelector('.gh-type-folder')
  const section = tpl.querySelector('section.gh-list')
  section.innerHTML = ''

  page.body.forEach(item => {
    if (item.type === 'dir') {
      let folder = articleFolder.cloneNode(true)
      folder.querySelector('h2 a.folderLink').innerText = item.name
      folder.querySelector('h2 a.folderLink').href = `#${item.path}`
      folder.querySelector('a.folderGhLink').href = item.url
      section.appendChild(folder)
    } else if (item.type === 'file') {
      console.log('item', item)
      let file = articleFile.cloneNode(true)
      file.querySelector('h2 a.fileLink').innerText = item.meta ? item.meta.title : item.name
      file.querySelector('h2 a.fileLink').href = `#${item.path}`
      file.querySelector('p.gh-list-excerpt').innerText = item.meta ? item.meta.description : ''
      file.querySelector('a.gh-list-readmore').title += item.meta ? item.meta.title : item.name
      file.querySelector('a.gh-list-readmore').href = `#${item.path}`
      section.appendChild(file)
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
