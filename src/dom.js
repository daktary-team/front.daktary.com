/* global route tpl */

/**
 * Functions dedicate to DOM interaction
 *
 */

const dom = {}

/**
 * ----------------
 * Public functions
 * ----------------
 */

/**
* Get anchor in html
*
* @return {Object} node anchor.
*/
dom.getAnchor = hash => document.querySelector(`a[name="${hash}"]`)

/**
* Render Github document in html
*
* @param {Object} page a json document from daktary API.
* @return {Object} documentFragment represents Github document in html.
*/
dom.render = page => {
  try {
    dom[dom._getRenderer(page.type)](page)
  } catch (err) {
    console.warn('err', err)
    const container = document.querySelector('main.container')
    container.innerHTML = page.body
  }
}

/**
 * -----------------
 * Private functions
 * -----------------
 */

/**
 * ----------
 * BreadCrumb
 * ----------
 */

/**
* Create DOM for breadcrumb.
*
* @param {Object} data a json breadcrumb data from daktary API.
* @return {Object} DOM partial DOM represents breadcrumb.
*/
dom._createBreadcrumb = data => {
  const {containerTpl, itemTpl, linkTpl} = tpl.getBreadCrumbTags()
  data.forEach(({ link, title }) => {
    const itemClone = itemTpl.cloneNode(true)
    itemClone.innerHTML = ''
    const linkClone = linkTpl.cloneNode(true)
    linkClone.innerHTML = ''

    linkClone.href = `#${link}`
    linkClone.append(title)
    itemClone.append(linkClone)
    
    containerTpl.append(itemClone)
  })
  return containerTpl
}

dom._prependBreadCrumb = (fragment, data) =>
  fragment.prepend(dom._createBreadcrumb(data))

/**
 * ------
 * Render
 * ------
 */

/**
* Get the method name to render the page.
*
* @param {String} type a file, a tree or a repo.
* @return {String} name of the method - ex. _renderTree.
*/
dom._getRenderer = type => {
  return `_render${type[0].toUpperCase()}${type.slice(1)}`
}

/**
* Get the method name to create the page.
*
* @param {String} type a file, a tree or a repo.
* @return {String} name of the method - ex. _createrTree.
*/
dom._getCreaterTree = type => {
  return `_createTree${type[0].toUpperCase()}${type.slice(1)}`
}

dom._renderHome = page => {
  const container = document.querySelector('main.container')
  container.innerHTML = page.body
}

/**
* Inject Github document in html
*
* @param {Object} page a json document from daktary API.
*/
dom._renderFile = page => {
  dom._injectTpl(dom._createFilePage(page))
}

/**
* Inject Github repos in html
*
* @param {Object} page a json tree from daktary API.
*/
dom._renderRepo = page => dom.renderTree()

/**
* Inject Github tree in html
*
* @param {Object} page a json tree from daktary API.
*/
dom._renderTree = page => {
  const containerTpl = tpl.getTreeTags().containerTpl
  dom._prependBreadCrumb(containerTpl, page.breadcrumb)
  page.body.forEach(item => {
    containerTpl.append(dom[dom._getCreaterTree(item.type)](item))
    dom._injectTpl(containerTpl)
  })
}

/**
* Create DOM for file's tree.
*
* @param {Object} file a json file from daktary API.
* @return {Object} DOM partial DOM represents file description.
*/
dom._createTreeFile = data => {
  const {containerTpl, linkTpl, readmoreLinkTpl, excerptTpl} = tpl.getTreeTags().file
  linkTpl.append(`${data.meta ? data.meta.title : data.name}`)
  linkTpl.href = `#${data.full_name}`
  excerptTpl.append(`${data.meta ? data.meta.description : ''}`)
  readmoreLinkTpl.title += data.meta ? data.meta.title : data.name
  readmoreLinkTpl.href = `#${data.full_name}`
  return containerTpl
}

/**
* Create DOM for Folder's tree.
*
* @param {Object} data a json repo from daktary API.
* @return {Object} DOM partial DOM represents repos or folders description.
*/
dom._createTreeDir = data => {
  const {containerTpl, linkTpl, githubLinkTpl} = tpl.getTreeTags().dir
  linkTpl.append(data.name)
  linkTpl.href = `#${data.full_name}`
  githubLinkTpl.href = data.html_url
  return containerTpl
}

/**
* Create DOM for Repo's tree.
*
* @param {Object} data a json repo from daktary API.
* @return {Object} DOM partial DOM represents repos description.
*/
dom._createTreeRepo = (tplTags, data) =>
  dom._createTreeDir(tplTags, data)

/**
* Create DOM for file page.
*
* @param {Object} data a json file from daktary API.
* @return {Object} DOM partial DOM represents file page.
*/
dom._createFilePage = data => {
  const {containerTpl, contentTpl, githubLinkTpl} = tpl.getFileTags()
  dom._prependBreadCrumb(containerTpl, data.breadcrumb)
  githubLinkTpl.href = `https://github.com/${dom._ghPath()}`
  contentTpl.insertAdjacentHTML('afterbegin', data.body)
  return containerTpl
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
