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
      console.log('page.type', page.type)
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
  const tpl = document.querySelector('template#tplTree').content
  const articleFile = tpl.querySelector('.gh-type-file')
  const articleFolder = tpl.querySelector('.gh-type-folder')
  const section = tpl.querySelector('section.gh-list')
  section.innerHTML = ''

  page.body.forEach(item => {
    if (item.type === 'dir') {
      let folder = articleFolder.cloneNode(true)
      folder.querySelector('h2 a.folderLink').innerText = item.name
      folder.querySelector('h2 a.folderLink').href = item.html_url
      folder.querySelector('a.folderGhLink').href = item.html_url
      section.appendChild(folder)
    } else if (item.type === 'file') {
      console.log('item', item)
      let file = articleFile.cloneNode(true)
      file.querySelector('h2 a.fileLink').innerText = item.meta ? item.meta.title : item.name
      file.querySelector('h2 a.fileLink').href = item.html_url
      file.querySelector('p.gh-list-excerpt').innerText += item.meta ? item.meta.description : ''
      section.appendChild(file)
    }
    dom._injectTpl(section)
  })
}
/*
      <article class="gh-list-item gh-type-file">
        <h2 class=gh-list-title><a href=></a></h2>
        <div class="gh-list-content">
          <div class="gh-list-meta"></div>
          <p class="gh-list-excerpt">Un système est un ensemble d'éléments interagissant entre eux selon certains principes ou règles. Les  études sur la complexité distinguent 4 niveaux de complexité décrits ici.</p>
          <a class="gh-list-readmore" title="Lire la suite de la fiche : 4 niveaux de complexité d'un système" href="#lilianricaud/travail-en-reseau/blob/master/4_niveaux_complexite_systeme.md">Lire la suite de la fiche</a>
         </div>
      </article>
*/

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
