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
  const tpl = document.querySelector('template#tplBlob').content
  tpl.querySelector('.blobGhLink').href = `https://github.com/${dom._ghPath()}`
  tpl.querySelector('.blobContent').innerHTML = page.body
  return tpl
}

/**
* Build a breadcrumb with path
*
* @param {String} type a github type like: repo, tree or files.
* @param {String} path a github path.
*/
dom._renderBreadcrumb = breadcrumbData => {
  
  const getLi = (ul, {link, title}) => {
    const li = ul.querySelector('li').cloneNode(true)
    const a = li.querySelector('a')
    a.href = `#${link}`
    a.innerText = title
    return li
  }

  const breadcrumb = document.querySelector('template#tplBreadcrumb').cloneNode(true).content
  const ul = breadcrumb.querySelector('ul')
  const div = document.querySelector('div.breadcrumb')
  breadcrumbData.forEach(elt => ul.appendChild(getLi(ul, elt)))
  div.innerHTML = ''
  div.appendChild(ul)
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
  dom._renderBreadcrumb(page.breadcrumb)
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

  dom._renderBreadcrumb(page.breadcrumb)

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
