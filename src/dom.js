/* global route */

/**
 * Functions dedicate to DOM interaction
 *
 */

const dom = {}

/**
 * Private functions
 */

/**
* Create DOM for blob page.
*
* @param {Object} page a json tree from daktary API.
* @return {Object} DOM partial DOM represents blob page.
*/
dom._createBlobPage = page => {
  const blob = document.querySelector('template#tplBlob').cloneNode(true).content
  blob.prepend(dom._createBreadcrumb(page.breadcrumb))
  blob.querySelector('.blobGhLink').href = `https://github.com/${dom._ghPath()}`
  blob.querySelector('.blobContent').insertAdjacentHTML('afterbegin', page.body)
  return blob
}

/**
* Create DOM for breadcrumb.
*
* @param {Object} breadcrumb a json breadcrumb data from daktary API.
* @return {Object} DOM partial DOM represents breadcrumb.
*/
dom._createBreadcrumb = breadcrumbData => {
  const getLi = (ul, {link, title}) => {
    const li = ul.querySelector('li').cloneNode(true)
    const a = li.querySelector('a')
    a.href = `#${link}`
    a.append(title)
    return li
  }
  const breadcrumb = document.querySelector('template#tplBreadcrumb').cloneNode(true).content
  const ul = breadcrumb.querySelector('ul')
  breadcrumbData.forEach(elt => ul.append(getLi(ul, elt)))
  return ul
}

/**
* Replace the html main.container's childrens by a template content
*
* @param {Object} templateContent a template content.
*/
dom._injectTpl = tpl => {
  const container = document.querySelector('main.container')
  container.innerHTML = ''
  container.append(document.importNode(tpl, true))
}

/**
* get ghPath with route.js
*
* @return {Object} node anchor.
*/
dom._ghPath = () =>
  route.getHash()

/**
 * Public functions
 */

/**
* get anchor in html
*
* @return {Object} node anchor.
*/
dom.getAnchor = hash =>
  document.querySelector(`a[name="${hash}"]`)

/**
* Inject Github document in html
*
* @param {Object} page a json document from daktary API.
*/
dom.injectBlobInHtml = page => {
  dom._injectTpl(dom._createBlobPage(page))
}

/**
* Inject Github tree in html
*
* @param {Object} page a json tree from daktary API.
*/
dom.injectTreeInHtml = page => {
  const tree = document.querySelector('template#tplTree').cloneNode(true).content
  const fileAlias = tree.querySelector('.ghTypeFile')
  const folderAlias = tree.querySelector('.ghTypeFolder')
  const repoAlias = tree.querySelector('.ghTypeRepo')
  const section = tree.querySelector('section.ghTree')
  section.innerHTML = ''
  section.prepend(dom._createBreadcrumb(page.breadcrumb))

  page.body.forEach(item => {
    switch (item.type) {
      case 'file':
        const file = fileAlias.cloneNode(true)
        file.querySelector('h2 a.fileLink').innerText = item.meta ? item.meta.title : item.name
        file.querySelector('h2 a.fileLink').href = `#${item.full_name}`
        file.querySelector('p.ghTreeExcerpt').innerText = item.meta ? item.meta.description : ''
        file.querySelector('a.ghTreeReadmore').title += item.meta ? item.meta.title : item.name
        file.querySelector('a.ghTreeReadmore').href = `#${item.full_name}`
        section.appendChild(file)
        break
      case 'dir':
        const folder = folderAlias.cloneNode(true)
        folder.querySelector('h2 a.folderLink').innerText = item.name
        folder.querySelector('h2 a.folderLink').href = `#${item.full_name}`
        folder.querySelector('a.folderGhLink').href = item.html_url
        section.appendChild(folder)
        break
      case 'repo':
        const repo = repoAlias.cloneNode(true)
        repo.querySelector('h2 a.repoLink').innerText = item.name
        repo.querySelector('h2 a.repoLink').href = `#${item.full_name}`
        repo.querySelector('a.repoGhLink').href = item.html_url
        section.appendChild(repo)
    }
    dom._injectTpl(section)
  })
}
