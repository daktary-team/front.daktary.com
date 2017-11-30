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
* Get tree template for a specific item.
*
* @param {Object} typeSelector a css selector to extract item from template.
* @return {Object} DOM partial DOM represents item.
*/
dom._getTplTree = typeSelector =>
  document.querySelector('template#tplTree')
  .cloneNode(true).content
  .querySelector(typeSelector)

/**
* Get breadcrumb template.
*
* @param {Object} selector a css selector.
* @return {Object} DOM partial DOM represents breadcrumb.
*/
dom._getTplBreadcrumb = selector =>
  document.querySelector('template#tplBreadcrumb')
    .cloneNode(true).content
    .querySelector('ul')

/**
* Create DOM for file's tree.
*
* @param {Object} file a json file from daktary API.
* @return {Object} DOM partial DOM represents file description.
*/
dom._createFile = fileData => {
  const file = dom._getTplTree('.ghTypeFile')
  file.querySelector('h2 a.fileLink')
    .append(`${fileData.meta ? fileData.meta.title : fileData.name}`)
  file.querySelector('h2 a.fileLink')
    .href = `#${fileData.full_name}`
  file.querySelector('p.ghTreeExcerpt')
    .append(`${fileData.meta ? fileData.meta.description : ''}`)
  file.querySelector('a.ghTreeReadmore')
    .title += fileData.meta ? fileData.meta.title : fileData.name
  file.querySelector('a.ghTreeReadmore')
    .href = `#${fileData.full_name}`
  return file
}

/**
* Create DOM for folder's tree.
*
* @param {Object} folderData a json folder from daktary API.
* @return {Object} DOM partial DOM represents folder description.
*/
dom._createFolder = folderData => {
  const folder = dom._getTplTree('.ghTypeFolder')
  folder.querySelector('h2 a.folderLink').append(folderData.name)
  folder.querySelector('h2 a.folderLink').href = `#${folderData.full_name}`
  folder.querySelector('a.folderGhLink').href = folderData.html_url
  return folder
}

/**
* Create DOM for repos's tree.
*
* @param {Object} repoData a json repo from daktary API.
* @return {Object} DOM partial DOM represents repo description.
*/
dom._createRepo = repoData => {
  const repo = dom._getTplTree('.ghTypeRepo')
  repo.querySelector('h2 a.repoLink').append(repoData.name)
  repo.querySelector('h2 a.repoLink').href = `#${repoData.full_name}`
  repo.querySelector('a.repoGhLink').href = repoData.html_url
  return repo
}

/**
* Create DOM for blob page.
*
* @param {Object} blobData a json file from daktary API.
* @return {Object} DOM partial DOM represents blob page.
*/
dom._createBlobPage = blobData => {
  const blob = document.querySelector('template#tplBlob').cloneNode(true).content
  blob.prepend(dom._createBreadcrumb(blobData.breadcrumb))
  blob.querySelector('.blobGhLink').href = `https://github.com/${dom._ghPath()}`
  blob.querySelector('.blobContent').insertAdjacentHTML('afterbegin', blobData.body)
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
  const ul = dom._getTplBreadcrumb('ul')
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
  const section = dom._getTplTree('section.ghTree')
  section.innerHTML = ''
  section.prepend(dom._createBreadcrumb(page.breadcrumb))

  page.body.forEach(item => {
    switch (item.type) {
      case 'file':
        section.append(dom._createFile(item))
        break
      case 'dir':
        section.append(dom._createFolder(item))
        break
      case 'repo':
        section.append(dom._createRepo(item))
    }
    dom._injectTpl(section)
  })
}
