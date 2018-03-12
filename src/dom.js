/* global route tpl */

/**
 * Functions dedicate to DOM interaction
 *
 */

const Dom = {}

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
Dom.getAnchor = (dom, hash) => dom.querySelector(`a[name="${hash}"]`)

/**
* Render Github document in html
*
* @param {Object} page a json document from daktary API.
* @return {Object} documentFragment represents Github document in html.
*/
Dom.render = page => {
  try {
    Dom[Dom._getRenderer(page.type)](page)
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
* @param {Object} tpl a breadcrumb template data.
* @param {Object} data a json breadcrumb data from daktary API.
* @return {Object} partial DOM represents breadcrumb.
*/
Dom._createBreadcrumb = ({containerTpl, itemTpl, linkTpl}, data) => {
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

/**
* Render the breadcrumb in fragment.
*
* @param {Object} fragment a DOM fragment represents page.
* @param {Object} data a json breadcrumb data from daktary API.
* @return {String} name of the method - ex. _renderTree.
*/
Dom._prependBreadCrumb = (fragment, data) =>
  fragment.prepend(Dom._createBreadcrumb(tpl.getBreadCrumbTags(), data))

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
Dom._getRenderer = type => {
  return `_render${type[0].toUpperCase()}${type.slice(1)}`
}

/**
* Get the method name to create the page.
*
* @param {String} type a file, a tree or a repo.
* @return {String} name of the method - ex. _createrTree.
*/
Dom._getCreaterTree = type => {
  return `_createTree${type[0].toUpperCase()}${type.slice(1)}`
}

Dom._renderHome = page => {
  const container = document.querySelector('main.container')
  container.innerHTML = page.body
}

/**
* Inject Github document in html
*
* @param {Object} page a json document from daktary API.
*/
Dom._renderFile = page => {
  Dom._injectTpl(Dom._createFilePage(page))
}

/**
* Inject Github repos in html
*
* @param {Object} page a json tree from daktary API.
*/
Dom._renderRepo = page => Dom.renderTree()

/**
* Inject Github tree in html
*
* @param {Object} page a json tree from daktary API.
*/
Dom._renderTree = page => {
  const containerTpl = tpl.getTreeTags().containerTpl
  Dom._prependBreadCrumb(containerTpl, page.breadcrumb)
  page.body.forEach(item => {
    containerTpl.append(Dom[Dom._getCreaterTree(item.type)](item))
    Dom._injectTpl(containerTpl)
  })
}

/**
* Create DOM for file's tree.
*
* @param {Object} file a json file from daktary API.
* @return {Object} DOM partial DOM represents file description.
*/
Dom._createTreeFile = data => {
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
Dom._createTreeDir = data => {
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
Dom._createTreeRepo = (tplTags, data) =>
  Dom._createTreeDir(tplTags, data)

/**
* Create DOM for file page.
*
* @param {Object} data a json file from daktary API.
* @return {Object} DOM partial DOM represents file page.
*/
Dom._createFilePage = data => {
  const {containerTpl, contentTpl, githubLinkTpl} = tpl.getFileTags()
  Dom._prependBreadCrumb(containerTpl, data.breadcrumb)
  githubLinkTpl.href = `https://github.com/${route.getHash()}`
  contentTpl.insertAdjacentHTML('afterbegin', data.body)
  return containerTpl
}

/**
* Replace the html main.container's childrens by a template content
*
* @param {Object} templateContent a template content.
*/
Dom._injectTpl = tpl => {
  const container = document.querySelector('main.container')
  container.innerHTML = ''
  container.append(document.importNode(tpl, true))
}
  
try {
  exports.Dom = Dom
} catch (e) {}
